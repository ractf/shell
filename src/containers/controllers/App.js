import React, { useState, useContext, useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";

import { ModalPrompt } from "../../components/Modal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { AppContext } from "./Contexts";
import Routes from "./Routes";
import { API } from "./API";

import { plugins, apiContext, Spinner, SectionTitle } from "ractf";

import lockImg from "./spine.png";
import "./App.scss";


// 3s grace period to connect to the server
const LOADED_TIMEOUT = 3000;


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

            setScrollback(scrollback + lineBuffer + "\n" + resp + `[www-data@ractfhost1 ${(d2 || dir)[(d2 || dir).length - 1] || "/"}]$ `);
            setLineBuffer("");
        } else {
            setLineBuffer(lineBuffer + String.fromCharCode(e.which));
        }
    }

    const onKeyDown = e => {
        if ((e.keyCode || e.which) === 8) {
            setLineBuffer(lineBuffer.substring(0, lineBuffer.length - 1))
        }
    }

    return <div className={"vimDiv"} tabIndex={"0"} onKeyDown={onKeyDown} onKeyPress={onKeyPress}>
        {scrollback}{lineBuffer}
    </div>
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const SiteLocked = ({ setLoaded }) => {
    const api = useContext(apiContext);
    const [countdownText, setCountdownText] = useState("");
    const cRef = useRef();
    const iRef = useRef();
    const shardData = useRef();
    const lastTime = useRef();
    if (!shardData.current) shardData.current = [];

    const pad = n => {
        if (n < 10) return "0" + n;
        return "" + n;
    }

    useInterval(() => {
        const delta = ((new Date(api.countdown.time)) - (new Date()) - api.countdown.offset) / 1000;
        const days = Math.floor(delta / 86400);
        const hours = Math.floor((delta % 86400) / 3600);
        const minutes = Math.floor((delta % 3600) / 60);
        const seconds = Math.floor((delta % 60));
        
        setCountdownText(("" + days) + " day" + (days === 1 ? "" : "s") + ", "
                        + pad(hours) + " hour" + (hours === 1 ? "" : "s") + ", "
                        + pad(minutes) + " minute" + (minutes === 1 ? "" : "s") + ", "
                        + pad(seconds) + " second" + (seconds === 1 ? "" : "s"));

        if (delta < 0) {
            setLoaded(false);
            api.openSite();
            setTimeout(() => {setLoaded(true)}, LOADED_TIMEOUT);
        }
    }, 100);

    const animate = time => {
        let dt = lastTime.current ? time - lastTime.current : 0;
        lastTime.current = time;
        requestAnimationFrame(animate);

        const canvas = cRef.current;
        const image = iRef.current;
        if (!canvas || !image) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        let shards = (canvas.width * canvas.height) / 25000;

        const drawShard = (x, y, scale, angle) => {
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(image, -image.width * scale, -image.height * scale, image.width * scale, image.height * scale);
            ctx.rotate(-angle);
            ctx.translate(-x, -y);
        };

        while (shardData.current.length < shards) {
            shardData.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * 2 * -canvas.height,
                scale: (Math.random() ** 4) / 2 + 0.5,
                angle: 0,
                rotate: (Math.random() - 0.5) / 4,
            })
        }

        let shard;
        for (let i = 0; i < shardData.current.length; i++) {
            shard = shardData.current[i];
            
            ctx.globalAlpha = (shard.scale - 0.5);
            drawShard(shard.x, shard.y, shard.scale, shard.angle);
            
            shard.y += shard.scale * 0.5 * dt;
            shard.angle += shard.scale * shard.rotate * dt / 1000;
            if (shard.y > canvas.height + image.height) {
                shardData.current.splice(i, 1);
                i--;
            }
        }
    };
    useEffect(animate, []);

    if (!api.ready) return <div className={"lockWrap"}><Spinner /></div>;
    return <div className={"lockWrap"}>
        <canvas ref={cRef} />
        <img alt={""} src={lockImg} style={{display: "none"}} ref={iRef} />
        <SectionTitle>Site Locked!</SectionTitle>
        <div className={"siteCountdown"}>Unlock in {countdownText}</div>
    </div>;
}

const App = () => {
    const api = useContext(apiContext);
    window.__api = api;

    const [console, setConsole] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [popups, setPopups] = useState([
        { type: 0, title: 'Achievement get', body: 'You got a thing!' },
        { type: 'medal', medal: 'winner' },
        { type: 0, title: 'Challenge solved', body: 'solved a thing' },
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

    // Countdown
    useEffect(() => {
        api.getCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Vim-mode
    useEffect(() => {
        const MAGIC = [27, 16, 186, 81, 16, 49, 13];

        const _handleKeyDown = event => {
            if (event.keyCode === 16 && typedText.current[typedText.current.length - 1] === 16)
                return
                typedText.current.push(event.keyCode);
            if (typedText.current.length > MAGIC.length)
                typedText.current = typedText.current.slice(typedText.current.length - MAGIC.length, typedText.current.length);
            if (JSON.stringify(typedText.current) === JSON.stringify(MAGIC))
                setConsole(true);
        }

        document.addEventListener("keydown", _handleKeyDown);
    }, []);

    // Warning banner
    useEffect(() => {
        setTimeout(() => { setLoaded(true) }, LOADED_TIMEOUT);
    }, []);

    if (!api.siteOpen) return <SiteLocked setLoaded={setLoaded} />;

    if (console) return <VimDiv />;

    const removePopup = (n) => {
        let popups_ = [...popups];
        popups_.splice(n, 1);
        setPopups(popups_);
    }
    let popupsEl = popups.map((popup, n) => {
        let handler = plugins.popup[popup.type];
        if (!handler) return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>Plugin handler missing for '{popup.type}'!</div>;
        return <div className={"eventPopup"} onClick={() => removePopup(n)} key={n}>{React.createElement(
            handler.component, { popup: popup, key: n }
        )}</div>;
    }).reverse();

    return (
        <AppContext.Provider value={{ promptConfirm: promptConfirm }}>
            {/* TODO: Use api.ready */}
            {!api.ready && loaded ? <div className={"siteWarning"}>
                Site operating in offline mode:
                    Failed to connect to the CTF servers!<br />
                Functionality will be limited until service is restored.
                </div> : null}
            {(api.user && api.user['2fa_status'] === "needs_verify") ? <div className={"siteWarning"}>
                A previous attempt to add 2-factor authentication to your account failed!<br />
                Please visit settings to finish configuration!
                </div> : null}

            <Header />
            <Routes />
            <Footer />

            {currentPrompt ? <ModalPrompt
                body={currentPrompt.body}
                promise={currentPrompt.promise}
                inputs={currentPrompt.inputs}
                onHide={hideModal}
            /> : null}

            <div className={"eventsWrap"}>
                {popupsEl}
            </div>
        </AppContext.Provider>
    );
}

export default () => <BrowserRouter><API><App /></API></BrowserRouter>;
