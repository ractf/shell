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


export const reloadAll = async (minimal) => {
    let userData = null, teamData = null, challenges = true;
    if (!minimal) {
        try {
            userData = await http.get(ENDPOINTS.USER + "self");
        } catch (e) {
            if (e.response && e.response.data)
                return logout(true, http.getError(e));
        }

        if (userData && userData.team !== null) {
            try {
                teamData = await http.get(ENDPOINTS.TEAM + "self");
            } catch (e) {
                if (e.request && e.request.status === 404) {
                    teamData = null;
                } else {
                    if (e.response && e.response.data)
                        return logout(true, http.getError(e));
                }
            }
        } else teamData = null;
    }

    try {
        challenges = await http.get(ENDPOINTS.CATEGORIES);
    } catch (e) {
        challenges = [];
    }

    store.dispatch(actions.initState({ user: userData, team: teamData, challenges }));
};
