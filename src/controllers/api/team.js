import * as actions from "actions";
import { store } from "store";
import { http } from "ractf";

import { ENDPOINTS } from "./consts";


export const modifyTeam = (teamId, data) => http.patch(ENDPOINTS.TEAM + teamId, data);

export const createTeam = (name, password) => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.TEAM_CREATE, { name, password }).then(async data => {
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
