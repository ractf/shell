import React, { useState, useContext, useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import { MdWarning } from 'react-icons/md';

import { ModalPrompt } from "../../components/Modal";
import Announcement from "../../components/Announcement";
import { SiteNav } from "../../components/SidebarTabs";
import ProgressBar from "../../components/ProgressBar";
import Scrollbar from "../../components/Scrollbar";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

import { AppContext } from "./Contexts";
import Routes from "./Routes";
import { API } from "./API";

import { plugins, apiContext, apiEndpoints, wsContext } from "ractf";

import lockImg from "../../static/spine.png";
import "./App.scss";


// 8s grace period to connect to the server
const LOADED_TIMEOUT = 8000;


const SpinningSpine = ({ text }) => <div className={"spinningSpine"}>
    <img alt={""} src={lockImg} />
    <span>{text}</span>
</div>;


const VimDiv = () => {
    const [scrollback, setScrollback] = useState(`[www-data@ractfhost1 shell]$ npm run build
[www-data@ractfhost1 shell]$ python3.7 -m http.server --directory build 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...

Keyboard interrupt received, exiting.

[www-data@ractfhost1 shell]$ `);
    const [lineBuffer, setLineBuffer] = useState("");
    const [dir, setDir] = useState(["var", "www", "shell"]);

    let d2;
    const onKeyPress = e => {
        if ((e.keyCode || e.which) === 13) {
            let resp;
            let [cmd, args] = lineBuffer.split(/ +/, 2);
            if (!cmd) resp = "";
            else if (cmd === "ls") {
                if (dir.length === 3) resp = ". .. index.html index.js index.css\n";
                else if (dir.length === 2) resp = ". .. shell\n";
                else if (dir.length === 1) resp = ". .. www\n";
                else resp = ". .. var\n";
            } else if (cmd === "cd") {
                resp = "";
                d2 = dir.slice(0, dir.length);
                if (args === "var" && dir.length === 0) d2.push("var");
                else if (args === "www" && dir.length === 1) d2.push("www");
                else if (args === "shell" && dir.length === 2) d2.push("shell");
                else if (args === ".." && dir.length !== 0) d2.pop();
                else if (args === ".");
                else resp = "ls: no such directory\n";
                setDir(d2);
            } else {
                resp = `rash: ${cmd}: command not found\n`;
            }

            setScrollback(scrollback + lineBuffer + "\n" + resp +
                `[www-data@ractfhost1 ${(d2 || dir)[(d2 || dir).length - 1] || "/"}]$ `);
            setLineBuffer("");
        } else {
            setLineBuffer(lineBuffer + String.fromCharCode(e.which));
        }
    };

    const onKeyDown = e => {
        if ((e.keyCode || e.which) === 8) {
            setLineBuffer(lineBuffer.substring(0, lineBuffer.length - 1));
        }
    };

    return <div className={"vimDiv"} tabIndex={"0"} onKeyDown={onKeyDown} onKeyPress={onKeyPress}>
        {scrollback}{lineBuffer}
    </div>;
};

const PopupMessage = ({ data }) => {
    const endpoints = useContext(apiEndpoints);

    return <div onClick={() => endpoints.hidePopup(data.id)}>
        <div>{data.title}</div>
        <div>{data.body}</div>
    </div>;
};

const WSSpine = () => {
    const ws = useContext(wsContext);
    if (ws.connected) return null;

    return <SpinningSpine
        text={"Lost connection. Reconnecting" + (ws.timer > 0 ? " in " + ws.timer + "s..." : "...")} />;
};

const LockWarn = () => {
    const api = useContext(apiContext);
    if (api.siteOpen) return null;
    if (api.config && (api.config.register_start_time * 1000) - (new Date()) > 0)
        return <div className={"lockWarning"}>
            <MdWarning /> Registration locked!
        </div>;
    return <div className={"lockWarning less"}>
        <MdWarning /> Challenges locked!
    </div>;
};

const App = React.memo(() => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    window.__api = api;

    const [consoleMode, setConsole] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [progressBar, setProgressBar] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [popups, setPopups] = useState([
        /*{ type: 0, title: 'Achievement get', body: 'You got a thing!' },
        { type: 'medal', medal: 'winner' },
        { type: 0, title: 'Challenge solved', body: 'solved a thing' },*/
    ]);
    const [announcements, setAnnouncements] = useState([
        //{title: "Hi there", body: "Ractf is go", time: new Date()}
    ]);
    const typedText = useRef();
    if (!typedText.current) typedText.current = [];

    const hideModal = () => {
        setCurrentPrompt(null);
    };

    const promptConfirm = (body, inputs = 0) => {
        if (inputs === 0) inputs = [];

        return new Promise((resolveOuter, rejectOuter) => {
            let innerPromise = new Promise((resolve, reject) => {
                setCurrentPrompt({ body: body, promise: { resolve: resolve, reject: reject }, inputs: inputs });
            });

            innerPromise.then(values => {
                hideModal();
                resolveOuter(values);
            }).catch(values => {
                hideModal();
                rejectOuter(values);
            });
        });
    };

    const showAlert = (message) => {
        setProgressBar(null);
        return promptConfirm({ message: message, noCancel: true, small: true });
    };

    const showProgress = (text, progress) => {
        if (text && !currentPrompt)
            setProgressBar({ text: text, progress: progress });
        else setProgressBar(null);
    };

    // Countdown
    useEffect(() => {
        endpoints.getCountdown();
    }, [endpoints]);

    // Vim-mode
    useEffect(() => {
        const MAGIC = [27, 16, 186, 81, 16, 49, 13];

        const _handleKeyDown = event => {
            if (event.keyCode === 16 && typedText.current[typedText.current.length - 1] === 16)
                return;
            typedText.current.push(event.keyCode);
            if (typedText.current.length > MAGIC.length)
                typedText.current = typedText.current.slice(typedText.current.length - MAGIC.length,
                    typedText.current.length);
            if (JSON.stringify(typedText.current) === JSON.stringify(MAGIC))
                setConsole(true);
        };

        document.addEventListener("keydown", _handleKeyDown);
    }, []);

    // Warning banner
    useEffect(() => {
        setTimeout(() => { setLoaded(true); }, LOADED_TIMEOUT);
    }, []);

    if (consoleMode) return <VimDiv />;

    const removePopup = (n) => {
        let popups_ = [...popups];
        popups_.splice(n, 1);
        setPopups(popups_);
    };
    let popupsEl = popups.map((popup, n) => {
        let handler = plugins.popup[popup.type];
        if (!handler) return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>
            Plugin handler missing for '{popup.type}'!
        </div>;
        return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>{React.createElement(
            handler.component, { popup: popup, key: n }
        )}</div>;
    }).reverse();
    let notifsEl = announcements.map((notif, n) => {
        let hide = () => {
            setAnnouncements(a => a.filter((i, m) => m !== n));
        };
        return <Announcement {...notif} key={n} hide={hide} />;
    }).reverse();

    let isAdmin = (api.user && api.user.is_staff);
    window.__ractf_alert = showAlert;
    return <Scrollbar primary><div className={"bodyScroll"}>
        {isAdmin && <LockWarn />}
        <AppContext.Provider value={{ promptConfirm: promptConfirm, alert: showAlert,
                showProgress: showProgress, setLoaded: setLoaded }}>
            {!api.ready && loaded ? <div className={"siteWarning"}>
                Site operating in offline mode:
                    Failed to connect to the CTF servers!<br />
                Functionality will be limited until service is restored.
                </div> : null}
            {(api.user && api.user.totp_status === 1) ? <div className={"siteWarning"}>
                A previous attempt to add 2-factor authentication to your account failed!<br />
                Please visit settings to finish configuration!
                </div> : null}

            <Header />
            <SiteNav>
                {<Routes />}
            </SiteNav>

            {currentPrompt ? <ModalPrompt
                body={currentPrompt.body}
                promise={currentPrompt.promise}
                inputs={currentPrompt.inputs}
                onHide={hideModal}
            /> : null}

            <div className={"popupMessages"}>
                {api.popups.map(i => <PopupMessage data={i} key={i.id} />)}
            </div>

            <div className={"eventsWrap"}>
                {popupsEl}
            </div>

            <div className={"announcementsWrap"}>
                {notifsEl}
            </div>

            {progressBar && <Modal small>
                {progressBar.text}
                <ProgressBar progress={progressBar.progress} />
            </Modal>}

            <WSSpine />
        </AppContext.Provider>
    </div></Scrollbar>;
});

export default () => <BrowserRouter><API><App /></API></BrowserRouter>;
