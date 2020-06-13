import { api, http } from "ractf";
import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";


export const reloadAll = async (minimal) => {
    let userData = null, teamData = null, challenges = true;
    if (!minimal) {
        try {
            userData = await http.get(ENDPOINTS.USER + "self");
        } catch (e) {
            if (e.response && e.response.data)
                return api.logout(true, http.getError(e));
        }

        if (userData && userData.team !== null) {
            try {
                teamData = await http.get(ENDPOINTS.TEAM + "self");
            } catch (e) {
                if (e.request && e.request.status === 404) {
                    teamData = null;
                } else {
                    if (e.response && e.response.data)
                        return api.logout(true, http.getError(e));
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
