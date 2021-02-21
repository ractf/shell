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
