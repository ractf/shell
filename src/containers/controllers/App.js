import React, { useState, useContext, useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";

import { ModalPrompt } from "../../components/Modal";
import { SiteNav } from "../../components/SidebarTabs";
import Header from "../../components/Header";
//import Footer from "../../components/Footer";

import { AppContext } from "./Contexts";
import Routes from "./Routes";
import { API } from "./API";

import { plugins, apiContext, apiEndpoints, wsContext, Spinner, SectionTitle, Button } from "ractf";

import lockImg from "./spine.png";
import bgm from "./synthwave.mp3";
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

const wave = { on: false, audio: null };

const SiteLocked = ({ setLoaded, setHasCode }) => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const [countdownText, setCountdownText] = useState("");
    const [swc, setWave] = useState(0);
    const cRef = useRef();
    const iRef = useRef();
    const shardData = useRef();
    const lastTime = useRef();
    const scan = useRef();
    if (!scan.current) scan.current = 0;
    if (!shardData.current) shardData.current = [];
    window._wave = wave;
    if (wave.on && !wave.audio) {
        wave.audio = (new AudioContext()).createBufferSource();

        let request = new XMLHttpRequest();
        request.open('GET', bgm, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            wave.audio.context.decodeAudioData(request.response, function (response) {
                wave.audio.buffer = response;
                wave.audio.loop = true;
                wave.audio.start(0);
                if (wave.on) wave.audio.connect(wave.audio.context.destination);
            }, function () { console.error('The request failed.'); });
        };
        request.send();
    }

    const pad = n => {
        if (n < 10) return "0" + n;
        return "" + n;
    };

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
            endpoints.openSite();
            setTimeout(() => { setLoaded(true); }, LOADED_TIMEOUT);
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
        let grd;

        const drawShards = () => {
            const drawShard = (x, y, scale, angle) => {
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.drawImage(image, -image.width * scale, -image.height * scale,
                    image.width * scale, image.height * scale);
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
                });
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

            ctx.globalAlpha = 1;
        };

        if (wave.on) {
            // Background
            ctx.fillStyle = "#7f1a7aff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Sun
            grd = ctx.createLinearGradient(0, canvas.height / 4, 0, canvas.height / 4 * 3);
            grd.addColorStop(0, "#ff2f87ff");
            grd.addColorStop(1, "#291888ff");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Shards
        drawShards();

        if (wave.on) {
            // Shards fade
            grd = ctx.createLinearGradient(0, canvas.height / 2 - 50, 0, canvas.height / 2);
            grd.addColorStop(0, "#7f1a7a00");
            grd.addColorStop(1, "#7f1a7aff");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ground
            ctx.fillStyle = "#291888ff";
            ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, canvas.height);

            ctx.strokeStyle = "#752fb6ff";
            ctx.lineWidth = 2;
            for (let i = 0; i < 11; i++) {
                //let prog = (i / 20) + (scan.current / 500);

                let prog = (((i + (scan.current / 50)) / 10) ** 3);

                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2 + (canvas.height / 2 * prog));
                ctx.lineTo(canvas.width, canvas.height / 2 + (canvas.height / 2 * prog));
                ctx.stroke();
            }
            scan.current = (scan.current + 0.1 * dt) % 50;
            for (let i = -400; i <= 400; i++) {
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2 + i * canvas.width / 1000, canvas.height / 2);
                ctx.lineTo(canvas.width / 2 + i * canvas.width / 5, canvas.height);
                ctx.stroke();
            }
        }
    };
    useEffect(animate, []);

    const hasCode = () => {
        let uname = prompt("c1");
        let passwd = prompt("c2");
        let otp = prompt("c3");
        endpoints.login(uname, passwd, otp);
    };

    if (!api.ready) return <div className={"lockWrap"}><Spinner /></div>;
    return <div className={"lockWrap"}>
        <canvas ref={cRef} />
        <img alt={""} src={lockImg} style={{ display: "none" }} ref={iRef} />
        <SectionTitle>Site Locked!</SectionTitle>
        <div className={"siteCountdown"}>Unlock in {countdownText}</div>

        <div className={"slide" + (wave.on ? " on" : "")} onClick={() => {
            wave.on = !wave.on;
            setWave(swc + 1);
            if (wave.audio) {
                wave.audio.loop = true;
                if (wave.on) wave.audio.connect(wave.audio.context.destination);
                else wave.audio.disconnect(wave.audio.context.destination);
            }
        }} />
        {!wave.on &&
            <Button lesser click={hasCode}>I have a code</Button>}
    </div>;
};


const PopupMessage = ({ data }) => {
    const endpoints = useContext(apiEndpoints);

    return <div onClick={() => endpoints.hidePopup(data.id)}>
        <div>{data.title}</div>
        <div>{data.body}</div>
    </div>;
};

const App = React.memo(() => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const ws = useContext(wsContext);
    window.__api = api;
    window.__ws = ws;

    const [hasCode, setHasCode] = useState(false);

    const [console, setConsole] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [loaded, setLoaded] = useState(false);
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

    const showAlert = (message) => (
        promptConfirm({ message: message, noCancel: true, small: true })
    );

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

    if (!process.env.REACT_APP_NO_SITE_LOCK)
        if (!api.siteOpen && !hasCode) return <SiteLocked setHasCode={setHasCode} setLoaded={setLoaded} />;

    if (console) return <VimDiv />;

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

    return (
        <AppContext.Provider value={{ promptConfirm: promptConfirm, alert: showAlert }}>
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
            <SiteNav>
                {<Routes />}
            </SiteNav>
            {/*<Footer />*/}

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

            {!ws.connected &&
                <SpinningSpine
                    text={"Lost connection. Reconnecting" + (ws.timer > 0 ? " in " + ws.timer + "s..." : "...")} />
            }
        </AppContext.Provider>
    );
});

export default () => <BrowserRouter><API><App /></API></BrowserRouter>;
