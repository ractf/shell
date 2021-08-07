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

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { recheckCountdowns } from "@ractf/api";
import { useInterval } from "@ractf/util";
import { mountPoint } from "@ractf/plugins";

import style from "./Countdown.module.scss";


export default ({ cdKey }) => {
    const { dates: countdown_dates } = useSelector(state => state.countdowns) || {};
    const [countdownText, setCountdownText] = useState("");
    const [showTip, setShowTip] = useState(false);

    const pad = n => {
        if (n < 10) return "0" + n;
        return "" + n;
    };

    useInterval(() => {
        if (!countdown_dates || !countdown_dates[cdKey]) {
            return setCountdownText("");
        }

        const now = new Date();
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

        if (delta < 60 * 10 && !showTip) {
            setShowTip(true);
        }

        if (delta === 0) {
            recheckCountdowns();
        }
    }, 100);

    useEffect(() => {
        document.title = "Countdown";
    }, []);

    return <div className={style.lockWrap}>
        {mountPoint("countdown")}

        <div className={style.lockTitle}>Site Locked!</div>
        <div className={style.siteCountdown}>{countdownText ? "Unlock in " + countdownText : ""}</div>
        <div className={style.tooltip} style={{opacity: showTip ? "100%" : "0%"}}>
            The site will update automatically - no need to refresh!
        </div>
    </div>;
};

