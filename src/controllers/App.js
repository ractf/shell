// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ConnectedRouter } from "connected-react-router";
import { useSelector } from "react-redux";
import { MdWarning } from "react-icons/md";

import SiteNav from "components/SiteNav";

import {
    ModalPrompt, ProgressBar, Scrollbar, Modal
} from "@ractf/ui-kit";

import { AppContext } from "./Contexts";
import * as actions from "actions";
import { history } from "store";
import Routes from "./Routes";
import WS from "./WS";

import { api, plugins, http } from "ractf";

import lockImg from "static/spine.png";
import "./App.scss";
import { store } from "store";


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
            const [cmd, args] = lineBuffer.split(/ +/, 2);
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

const WSSpine = () => {
    const ws = useSelector(store => store.websocket) || {};
    if (ws.connected) return null;

    return <SpinningSpine
        text={"Lost connection. Reconnecting" + (ws.timer > 0 ? " in " + ws.timer + "s..." : "...")} />;
};

const LockWarn = () => {
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};

    if (!countdown_passed.registration_open)
        return <div className={"lockWarning"}>
            <MdWarning /> Registration locked!
            </div>;
    if (!countdown_passed.countdown_timestamp)
        return <div className={"lockWarning less"}>
            <MdWarning /> Challenges locked!
        </div>;
    return null;
};

class FirstLoader extends React.Component {
    componentDidMount() {
        if (store.getState().token)
            api.reloadAll();

        http.get(api.ENDPOINTS.CONFIG).then(config => {
            store.dispatch(actions.setConfig(config));
        }).catch((e) => {
            console.error("Error loading config:", e);
        });
    }
    render = () => null;
}

const App = React.memo(() => {
    const user = useSelector(state => state.user);
    useMemo(() => { new WS(); }, []);

    const [consoleMode, setConsole] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [progressBar, setProgressBar] = useState(null);
    const [popups, setPopups] = useState([
        /*{ type: 0, title: 'Achievement get', body: 'You got a thing!' },
        { type: 'medal', medal: 'winner' },
        { type: 0, title: 'Challenge solved', body: 'solved a thing' },*/
    ]);
    const typedText = useRef();
    if (!typedText.current) typedText.current = [];

    const hideModal = () => {
        setCurrentPrompt(null);
    };

    const promptConfirm = (body, inputs = 0) => {
        if (inputs === 0) inputs = [];

        return new Promise((resolveOuter, rejectOuter) => {
            const innerPromise = new Promise((resolve, reject) => {
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

    useEffect(() => {
        api.getCountdown();
    }, []);

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

    if (consoleMode) return <VimDiv />;

    const removePopup = (n) => {
        const popups_ = [...popups];
        popups_.splice(n, 1);
        setPopups(popups_);
    };
    const popupsEl = popups.map((popup, n) => {
        const handler = plugins.popup[popup.type];
        if (!handler) return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>
            Plugin handler missing for <code>{popup.type}</code>!
        </div>;
        return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>{React.createElement(
            handler.component, { popup: popup, key: n }
        )}</div>;
    }).reverse();

    const isAdmin = (user && user.is_staff);
    window.__ractf_alert = showAlert;
    return <Scrollbar primary><div className={"bodyScroll"}>
        {isAdmin && <LockWarn />}
        <AppContext.Provider value={{
            promptConfirm: promptConfirm, alert: showAlert,
            showProgress: showProgress
        }}>
            {/*!api.ready && loaded ? <div className={"siteWarning"}>
                Site operating in offline mode:
                    Failed to connect to the CTF servers!<br />
                Functionality will be limited until service is restored.
        </div> : null*/}

            <SiteNav>
                {<Routes />}
            </SiteNav>

            {currentPrompt ? <ModalPrompt
                body={currentPrompt.body}
                promise={currentPrompt.promise}
                inputs={currentPrompt.inputs}
                onHide={hideModal}
            /> : null}

            <div className={"eventsWrap"}>
                {popupsEl}
            </div>

            {progressBar && <Modal small>
                {progressBar.text}
                <ProgressBar progress={progressBar.progress} />
            </Modal>}

            <WSSpine />

            <FirstLoader />
            {Object.entries(plugins.mountWithinApp).map(([key, value]) => (
                React.createElement(value.component, { key })
            ))}
        </AppContext.Provider>
    </div></Scrollbar>;
});

const AppWrap = () => <ConnectedRouter history={history}>
    <App />
</ConnectedRouter>;
export default AppWrap;
