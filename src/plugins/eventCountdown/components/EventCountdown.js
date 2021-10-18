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

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IoMdStopwatch } from "react-icons/io";

import { useInterval } from "@ractf/util";
import { ToggleTab } from "@ractf/ui-kit";


const EventCountdown = () => {
    const { dates: countdown_dates, passed } = useSelector(state => state.countdowns) || {};
    const [countdown, setCountdown] = useState(null);

    const pad = n => (n < 10 ? "0" : "") + n;
    useInterval(() => {
        const cdKey = passed["countdown_timestamp"] ? "competition_end" : "countdown_timestamp";

        if (!countdown_dates || !countdown_dates[cdKey]) {
            return setCountdown(null);
        }

        const now = new Date();
        let delta = ((new Date(countdown_dates[cdKey])) - now) / 1000;
        if (delta < 0) return setCountdown(null);

        delta = Math.max(0, delta);
        const days = Math.floor(delta / 86400);
        const hours = Math.floor((delta % 86400) / 3600);
        const minutes = Math.floor((delta % 3600) / 60);
        const seconds = Math.floor((delta % 60));

        setCountdown(`${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }, 1000);

    return <>
    {countdown && <ToggleTab Icon={IoMdStopwatch}>
        {countdown}
    </ToggleTab>}</>;
};
export default EventCountdown;
