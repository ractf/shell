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

export const getError = e => {
    if (e) {
        if (e.response && e.response.data) {
            // We got a response from the server, but it wasn't happy with something
            if (e.response.data.m || e.response.data.d) {
                let error = e.response.data.m;
                if (error) {
                    let translated_m = error;
                    if (config.getTranslation)
                        translated_m = config.getTranslation("api." + error);
                    if (translated_m !== error && (typeof translated_m) !== "object")
                        error = translated_m;
                }

                if (typeof e.response.data.d === "string") {
                    if (e.response.data.d.length > 0) {
                        let error_d = e.response.data.d;
                        let translated_d = error_d;
                        if (config.getTranslation)
                            translated_d = config.getTranslation("api." + error_d);
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
