import * as actions from "actions";
import { store } from "store";
import { http } from "ractf";

import { ENDPOINTS } from "./consts";


export const newFile = (chalId, name, url, size) => (
    http.post(ENDPOINTS.FILE, { challenge: chalId, name, url, size }).then(data => {
        store.dispatch(actions.addFile(chalId, data));
        return data;
    })
);

export const editFile = (id, name, url, size) => (
    http.patch(ENDPOINTS.FILE + id, { name, url, size }).then(() => {
        store.dispatch(actions.editFile(id, { name, url, size }));
        return { name, url, size };
    })
);

export const removeFile = (id) => (
    http.delete_(ENDPOINTS.FILE + id).then(data => {
        store.dispatch(actions.removeFile(id));
        return data;
    })
);
