import { api, http } from "ractf";
import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";


export const createGroup = (name, desc, type) => {
    return http.post(ENDPOINTS.CATEGORIES, {
        name, metadata: null, description: desc, contained_type: type
    }).then(data => {
        store.dispatch(actions.addCategory(data));
        return data;
    });
};
export const removeGroup = async (id) => {
    return http.delete(ENDPOINTS.CATEGORIES + id).then(() => {
        return api.reloadAll();
    }).then(data => {
        store.dispatch(actions.removeCategory(data));
        return data;
    });
};
export const editGroup = (id, name, desc, type) => {
    return http.patch(ENDPOINTS.CATEGORIES + id, {
        name, description: desc, contained_type: type
    }).then(data => {
        store.dispatch(actions.editCategory(data));
        return data;
    });
};
