import * as actions from "actions";
import { store } from "store";
import { http } from "ractf";

import { ENDPOINTS } from "./consts";


export const newHint = (challenge, name, penalty, text) => (
    http.post(ENDPOINTS.HINT, { challenge, name, penalty, text }).then(data => {
        store.dispatch(actions.addHint(challenge, data));
        return data;
    })
);

export const editHint = (id, name, cost, text) => (
    http.patch(ENDPOINTS.HINT + id, { name, cost, text }).then(() => {
        store.dispatch(actions.editHint(id, { name, cost, text }));
        return { name, cost, text };
    })
);

export const removeHint = (id) => (
    http.delete(ENDPOINTS.HINT + id).then(data => {
        store.dispatch(actions.removeHint(id));
        return data;
    })
);

export const useHint = (id) => (
    http.post(ENDPOINTS.USE_HINT, { id }).then(data => {
        store.dispatch(actions.editHint(id, { text: data.text, used: true }));
        return data;
    })
);
