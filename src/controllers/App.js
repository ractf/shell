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

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ConnectedRouter } from "connected-react-router";
import { useSelector } from "react-redux";

import SiteNav from "components/SiteNav";

import {
    ProgressBar, Scrollbar, Modal, ModalPrompt, ToggleTabHolder
} from "@ractf/ui-kit";

import { AppContext } from "./Contexts";
import * as actions from "actions";
import { history } from "store";
import Routes from "./Routes";
import WS from "./WS";

import { reloadAll, getCountdown, ENDPOINTS, getConfig } from "@ractf/api";
import { iteratePlugins, PluginComponent } from "@ractf/plugins";
import http from "@ractf/http";

import lockImg from "static/spine.png";
import "./App.scss";
import { store } from "store";


const LOADING_TIMEOUT = 5000;


let SpinningSpine = ({ text }) => <div className={"spinningSpine"}>
    <img alt={""} src={lockImg} />
    <span>{text}</span>
</div>;
SpinningSpine = React.memo(SpinningSpine);


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

let WSSpine = () => {
    const ws = useSelector(state => state.websocket) || {};
    if (ws.connected) return null;

    return <SpinningSpine
        text={"Lost connection. Reconnecting" + (ws.timer > 0 ? " in " + ws.timer + "s..." : "...")} />;
};
WSSpine = React.memo(WSSpine);

class FirstLoader extends React.Component {
    componentDidMount() {
        if (store.getState().token)
            reloadAll();

        http.get(ENDPOINTS.CONFIG).then(config => {
            store.dispatch(actions.setConfig(config));
        }).catch((e) => {
            console.error("Error loading config:", e);
        });
    }
    render = () => null;
}

const SiteLoading = () => {
    const timeout = useRef();
    const [warning, setWarning] = useState(false);
    const showWarning = useCallback(() => {
        setWarning(true);
    }, []);
    useEffect(() => {
        timeout.current = setTimeout(showWarning, LOADING_TIMEOUT);
        return () => { clearTimeout(timeout.current); };
    }, [showWarning]);

    return <div className={"siteLoading"}>
        <SpinningSpine />
        <div className={"loadingWarn"} style={{ opacity: warning ? 1 : 0 }}>
            We appear to be having some trouble connecting right now.
            <br />
            Please check <a target="_blank" rel="noopener noreferrer"
                href="https://reallyawesome.atlassian.net/servicedesk/customer/kb/view/21397511">
                the documentation
            </a> for more information.
        </div>
    </div>;
};

const App = React.memo(() => {
    useMemo(() => { new WS(); }, []);

    const countdowns = useSelector(state => state.countdowns);
    const config = useSelector(state => state.config);

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
        getCountdown();
        getConfig();
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

    if (!countdowns || !config) return <SiteLoading />;

    const removePopup = (n) => {
        const popups_ = [...popups];
        popups_.splice(n, 1);
        setPopups(popups_);
    };
    const popupsEl = popups.map((popup, n) => {
        return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>
            <PluginComponent type={"popup"} name={popup.type} popup={popup} key={n} />
        </div>;
    }).reverse();

    window.__ractf_alert = showAlert;
    return <Scrollbar primary><div className={"bodyScroll"}>
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
                <Routes />
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
            {iteratePlugins("mountWithinApp").map(({ key, plugin }) => (
                React.createElement(plugin.component, { key })
            ))}
            <ToggleTabHolder>
                {iteratePlugins("toggleTabs").map(({ key, plugin }) => (
                    React.createElement(plugin.component, { key })
                ))}
            </ToggleTabHolder>
        </AppContext.Provider>
    </div></Scrollbar>;
});

const AppWrap = () => <ConnectedRouter history={history}>
    <App />
</ConnectedRouter>;
export default AppWrap;
