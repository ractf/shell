// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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

import * as http from "@ractf/util/http";

import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";
import { reloadAll } from "./reloadAll";


export const modifyTeam = (teamId, data) => http.patch(ENDPOINTS.TEAM + teamId, data);

export const createTeam = (name, password, leaderboard_group) => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.TEAM_CREATE, { name, password, leaderboard_group }).then(async data => {
            const team = await http.get("/team/self");
            store.dispatch(actions.setTeam(team));
            resolve(data);
        }).catch(reject);
    });
};

export const joinTeam = (name, password) => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.TEAM_JOIN, { name, password }).then(async data => {
            const team = await http.get("/team/self");
            store.dispatch(actions.setTeam(team));
            resolve(data);
        }).catch(reject);
    });
};

export const leaveTeam = () => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.TEAM_LEAVE).then(async () => {
            await reloadAll();
            resolve();
        }).catch(reject);
    });
};
