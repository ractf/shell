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
