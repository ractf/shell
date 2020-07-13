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

import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdStopwatch } from "react-icons/io";

import { useInterval, makeClass } from "@ractf/util";

import style from "./EventCountdown.module.scss";
import { setCountdownVis } from "../actions";


const EventCountdown = ({ cdKey = "competition_end" }) => {
    const { offset: countdown_offset, dates: countdown_dates } = useSelector(state => state.countdowns) || {};
    const dispatch = useDispatch();
    const open = useSelector(state => state.eventCountdown);
    const [countdown, setCountdown] = useState(null);

    const toggle = useCallback(() => {
        dispatch(setCountdownVis(!open));
    }, [dispatch, open]);

    const pad = n => (n < 10 ? "0" : "") + n;
    useInterval(() => {
        if (!countdown_dates || !countdown_dates[cdKey]) {
            return setCountdown(null);
        }

        const now = (new Date()) - (-countdown_offset);
        let delta = ((new Date(countdown_dates[cdKey])) - now) / 1000;
        if (delta < 0) return setCountdown(null);

        delta = Math.max(0, delta);
        const days = Math.floor(delta / 86400);
        const hours = Math.floor((delta % 86400) / 3600);
        const minutes = Math.floor((delta % 3600) / 60);
        const seconds = Math.floor((delta % 60));

        setCountdown(`${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    if (!countdown) return null;
    return <div className={makeClass(style.countdown, !open && style.closed)} onClick={toggle}>
        {open ? countdown : <IoMdStopwatch />}
    </div>;
};
export default EventCountdown;
