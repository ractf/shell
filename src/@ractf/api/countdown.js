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

import { getChallenges } from "@ractf/api";
import * as actions from "actions";
import { store } from "store";
import * as http from "@ractf/util/http";

import { ENDPOINTS } from "./consts";


export const recheckCountdowns = (old) => {
    const oldCountdown = store.getState().countdowns;
    if (!oldCountdown) return;

    const countdown = {
        ...(old || oldCountdown),
        passed: {},
    };
    // This double negative is intentional.
    // If "+" is used, JS concatinates the int to the date as a string.
    const now = (new Date()) - (-countdown.offset);
    let changed = false;
    Object.entries(countdown.dates).forEach(([key, value]) => {
        countdown.passed[key] = value - now < 0;
        if (countdown.passed[key] !== oldCountdown.passed[key])
            changed = true;
    });
    if (old) return countdown;
    if (changed) getChallenges();

    store.dispatch(actions.setCountdowns(countdown));
};

export const getCountdown = () => http.get(ENDPOINTS.COUNTDOWN).then(data => {
    const serverTime = new Date(data.server_timestamp);
    const offset = serverTime - (new Date());

    const countdown = {
        dates: {},
        passed: {},
    };
    Object.entries(data).forEach(([key, value]) => {
        if (key === "server_timestamp") return;
        countdown.dates[key] = value * 1000 - offset;
        countdown.passed[key] = (countdown.dates[key] + offset) - serverTime < 0;
    });

    store.dispatch(actions.setCountdowns(countdown));
});
