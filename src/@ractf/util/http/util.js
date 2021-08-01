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

const config = {
    base: "",
    getHeaders: null,
    getTranslation: null,
};
export const setConfig = (conf) => {
    Object.keys(conf).forEach(i => config[i] = conf[i]);
};

export const _getHeaders = (extra) => {
    let headers = extra ? { ...extra } : {};
    if (config.getHeaders)
        headers = { ...headers, ...config.getHeaders(extra, headers) };
    return headers;
};

export const prefixBase = (url) => {
    if (url.indexOf("http://") === 0)
        return "https://" + url.substring(7, url.length);
    if (url.indexOf("https://") === 0)
        return url;
    return config.base + url;
};

export const appendSlash = url => {
    // Split the url and the query string
    const chunks = /^([^?]*?)(\?.*)?$/.exec(url).slice(1);
    const query = chunks[1];
    let base = chunks[0];
    // Ensure we always have a trailing slash
    if (!(/.*\/$/.test(base))) base = base + "/";
    return base + (query || "");
};

const tryTranslate = m => {
    let translated = m;
    if (config.getTranslation)
        translated = config.getTranslation("api." + m);
    if (translated !== m && (typeof translated) !== "object")
        return translated;
    return m;
};

export const getError = e => {
    if (e) {
        if (e.response && e.response.data) {
            // We got a response from the server, but it wasn't happy with something
            if (e.response.data.m || e.response.data.d) {
                let error = e.response.data.m;
                if (error) {
                    if (error === "invalid"
                        && typeof e.response.data.d === "object"
                        && e.response.data.d.non_field_errors)
                        error = "";
                    else
                        error = tryTranslate(error);
                }

                if (typeof e.response.data.d === "string") {
                    if (e.response.data.d.length > 0) {
                        error += "\n" + tryTranslate(e.response.data.d);
                    }
                } else if (e.response.data.d.non_field_errors) {
                    for (const i of e.response.data.d.non_field_errors) {
                        error += "\n" + tryTranslate(i);
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

export const addParams = (url, params) => {
    if (!params)
        return url;

    return url + "?" + new URLSearchParams(
        // Filter out any params with undefined or null, leaving other falsy values
        Object.fromEntries(Object.entries(params).filter(
            i => (i[1] !== null) && (typeof i[1] !== "undefined")
        ))
    );
};

export const prepareUrl = (url, params) => (
    addParams(appendSlash(prefixBase(url)), params)
);
