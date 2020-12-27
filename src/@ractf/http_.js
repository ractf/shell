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

import i18next from "i18next";
import axios from "axios";
import { store } from "store";

import { BASE_URL } from "./api/consts";


const _getHeaders = (extra) => {
    const headers = extra ? { ...extra } : {};
    const token = store.getState().token?.token;
    if (token)
        headers.Authorization = `Token ${token}`;
    return headers;
};

const prefixBase = (url) => {
    if (url.indexOf("http://") === 0)
        return "https://" + url.substring(7, url.length);
    if (url.indexOf("https://") === 0)
        return url;
    return BASE_URL + url;
};

const appendSlash = url => {
    // Split the url and the query string
    const chunks = /^([^?]*?)(\?.*)?$/.exec(url).slice(1);
    const query = chunks[1];
    let base = chunks[0];
    // Ensure we always have a trailing slash
    if (!(/.*\/$/.test(base))) base = base + "/";
    return base + (query || "");
};

export const getError = e => {
    if (e) {
        if (e.response && e.response.data) {
            // We got a response from the server, but it wasn't happy with something
            if (e.response.data.m || e.response.data.d) {
                let error = e.response.data.m;
                if (error) {
                    const translated_m = i18next.t("api." + error);
                    if (translated_m !== error && (typeof translated_m) !== "object")
                        error = translated_m;
                }

                if (typeof e.response.data.d === "string") {
                    if (e.response.data.d.length > 0) {
                        let error_d = e.response.data.d;
                        const translated_d = i18next.t("api." + error_d);
                        if (translated_d !== error && (typeof translated_d) !== "object")
                            error_d = translated_d;
                        error += "\n" + error_d;
                    }
                }

                return error.trim();
            }
            return e.response.data.toString();
        } else if (e.message) {
            // We didn't get a response from the server, but the browser is happy to tell us why
            return e.message;
        }
    }
    // TITSUP!
    return "Unknown error occurred.";
};

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
