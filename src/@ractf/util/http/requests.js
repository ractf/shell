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

import axios from "axios";
import { appendSlash, prefixBase, _getHeaders } from "./util";

export const abortableGet = (url, params) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    return [new Promise((resolve, reject) => {
        axios({
            url: appendSlash(prefixBase(url)),
            params: params,
            cancelToken: source.token,
            method: "get",
            headers: _getHeaders(),
        }).then(response => {
            resolve(response.data.d);
        }).catch(reject);
    }), source.cancel];
};

export const makeRequest = (method, url, data, headers, params, multipart, onUploadProgress) => {
    const localHeaders = { ...headers };
    let localData = data;
    if (multipart) {
        localData = new FormData();
        Object.keys(data).forEach(i => {
            localData.append(i, data[i]);
        });
        localHeaders["Content-Type"] = "multipart/form-data";
    }
    return new Promise((resolve, reject) => {
        axios({
            url: appendSlash(prefixBase(url)),
            params: params,
            method: method,
            data: localData,
            headers: _getHeaders(localHeaders),
            onUploadProgress: onUploadProgress,
        }).then(response => {
            resolve(response.data.d);
        }).catch(reject);
    });
};

export const get = makeRequest.bind(this, "get");
export const post = makeRequest.bind(this, "post");
export const put = makeRequest.bind(this, "put");
export const patch = makeRequest.bind(this, "patch");
export const delete_ = makeRequest.bind(this, "delete");
