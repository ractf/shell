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

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { recheckCountdowns } from "@ractf/api";
//import { Spinner } from "@ractf/ui-kit";

import lockImg from "static/spine.png";

import "./Countdown.scss";

const BGM = "/synthwave.mp3";

const wave = { on: false, audio: null };

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
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default ({ cdKey }) => {
    const { offset: countdown_offset, dates: countdown_dates } = useSelector(state => state.countdowns) || {};
    const [countdownText, setCountdownText] = useState("");
    const [swc, setWave] = useState(0);
    const wrapRef = useRef();
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

        const request = new XMLHttpRequest();
        request.open("GET", BGM, true);
        request.responseType = "arraybuffer";
        request.onload = function () {
            wave.audio.context.decodeAudioData(request.response, function (response) {
                wave.audio.buffer = response;
                wave.audio.loop = true;
                wave.audio.start(0);
                if (wave.on) wave.audio.connect(wave.audio.context.destination);
            }, function () { console.error("The request failed."); });
        };
        request.send();
    }

    const pad = n => {
        if (n < 10) return "0" + n;
        return "" + n;
    };

    useInterval(() => {
        if (!countdown_dates || !countdown_dates[cdKey]) {
            return setCountdownText("");
        }

        // This double negative is intentional.
        // If "+" is used, JS concatinates the int to the date as a string.
        const now = (new Date()) - (-countdown_offset);
        let delta = ((new Date(countdown_dates[cdKey])) - now) / 1000;
        delta = Math.max(0, delta);
        const days = Math.floor(delta / 86400);
        const hours = Math.floor((delta % 86400) / 3600);
        const minutes = Math.floor((delta % 3600) / 60);
        const seconds = Math.floor((delta % 60));

        setCountdownText(("" + days) + " day" + (days === 1 ? "" : "s") + ", "
            + pad(hours) + " hour" + (hours === 1 ? "" : "s") + ", "
            + pad(minutes) + " minute" + (minutes === 1 ? "" : "s") + ", "
            + pad(seconds) + " second" + (seconds === 1 ? "" : "s"));

        if (delta === 0) {
            recheckCountdowns();
        }
    }, 100);

    const animate = time => {
        const dt = lastTime.current ? time - lastTime.current : 0;
        lastTime.current = time;
        requestAnimationFrame(animate);

        const canvas = cRef.current;
        const image = iRef.current;
        if (!canvas || !image) return;
        canvas.width = wrapRef.current.getBoundingClientRect().width;
        canvas.height = wrapRef.current.getBoundingClientRect().height;
        const ctx = canvas.getContext("2d");

        const shards = (canvas.width * canvas.height) / 25000;
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

                const prog = (((i + (scan.current / 50)) / 10) ** 3);

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

    //if (!api.ready) return <div className={"lockWrap"}><Spinner /></div>;
    return <div className={"lockWrap"} ref={wrapRef}>
        <canvas ref={cRef} />
        <img alt={""} src={lockImg} style={{ display: "none" }} ref={iRef} />
        <div className={"lockTitle"}>Site Locked!</div>
        <div className={"siteCountdown"}>{countdownText ? "Unlock in " + countdownText : ""}</div>

        <div className={"slide" + (wave.on ? " on" : "")} onClick={() => {
            wave.on = !wave.on;
            setWave(swc + 1);
            if (wave.audio) {
                wave.audio.loop = true;
                if (wave.on) wave.audio.connect(wave.audio.context.destination);
                else wave.audio.disconnect(wave.audio.context.destination);
            }
        }} />
    </div>;
};

