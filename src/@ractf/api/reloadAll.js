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

import * as actions from "actions";
import { logout } from "@ractf/api";
import { store } from "store";
import http from "@ractf/http";

import { ENDPOINTS } from "./consts";


export const reloadSelf = async (shouldUpdate = true) => {
    let userData = null;

    try {
        userData = await http.get(ENDPOINTS.USER + "self");
    } catch (e) {
        if (e.response && e.response.data) {
            logout(true, http.getError(e));
            return undefined;
        }
    }
    if (!shouldUpdate)
        return userData;
    store.dispatch(actions.setUser(userData));
};

export const reloadTeam = async (shouldUpdate = true) => {
    let teamData = null;

    try {
        teamData = await http.get(ENDPOINTS.TEAM + "self");
    } catch (e) {
        if (e.request && e.request.status === 404) {
            teamData = null;
        } else {
            if (e.response && e.response.data) {
                logout(true, http.getError(e));
                return undefined;
            }
        }
    }
    if (!shouldUpdate)
        return teamData;
    store.dispatch(actions.setTeam(teamData));
};

export const reloadAll = async (minimal, noChallenges) => {
    const hasTeams = (store.getState().config || {}).enable_teams;
    const token = store.getState().token?.token;

    let userData = undefined, teamData = undefined, challenges = undefined;
    if (token && !minimal) {
        if (typeof (userData = await reloadSelf(false)) === "undefined")
            return;

        if (hasTeams && userData && userData.team !== null) {
            if (typeof (teamData = await reloadTeam(false)) === "undefined")
                return;
        } else teamData = null;
    }

    if (!noChallenges) {
        try {
            challenges = await http.get(ENDPOINTS.CATEGORIES);
        } catch (e) {
            challenges = undefined;
        }
    }

    store.dispatch(actions.initState({ user: userData, team: teamData, challenges }));
};
