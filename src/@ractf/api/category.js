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
import { reloadAll } from "@ractf/api";
import { store } from "store";
import http from "@ractf/http";

import { ENDPOINTS } from "./consts";


export const createGroup = (name, desc, type, metadata) => {
    return http.post(ENDPOINTS.CATEGORIES, {
        name, metadata: metadata || {}, description: desc, contained_type: type
    }).then(data => {
        store.dispatch(actions.addCategory(data));
        return data;
    });
};
export const removeGroup = async (id) => {
    return http.delete(ENDPOINTS.CATEGORIES + id).then(() => {
        return reloadAll();
    }).then(data => {
        store.dispatch(actions.removeCategory(data));
        return data;
    });
};
export const editGroup = (id, name, desc, type, metadata) => {
    return http.patch(ENDPOINTS.CATEGORIES + id, {
        name, description: desc, contained_type: type, metadata: metadata
    }).then(data => {
        store.dispatch(actions.editCategory(data));
        return data;
    });
};
