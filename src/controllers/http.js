import i18next from "i18next";
import axios from "axios";
import { store } from "store";

import { BASE_URL } from "./api/consts";


const _getHeaders = (extra) => {
    const headers = extra ? { ...extra } : {};
    const token = store.getState().token;
    if (token)
        headers.Authorization = `Token ${token}`;
    return headers;
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
    if (e.response && e.response.data) {
        // We got a response from the server, but it wasn't happy with something
        if (e.response.data.m) {
            let error = e.response.data.m;
            const translated = i18next.t("api." + error);
            if (translated !== error && (typeof translated) !== "object") error = translated;

            if (typeof e.response.data.d === "string")
                if (e.response.data.d.length > 0)
                    error += "\n" + e.response.data.d;

            return error;
        }
        return e.response.data.toString();
    } else if (e.message) {
        // We didn't get a response from the server, but the browser is happy to tell us why
        return e.message;
    }
    // TITSUP!
    return "Unknown error occurred.";
};

export const abortableGet = (url) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    return [new Promise((resolve, reject) => {
        axios({
            url: appendSlash(BASE_URL + url),
            cancelToken: source.token,
            method: "get",
            headers: _getHeaders(),
        }).then(response => {
            resolve(response.data.d);
        }).catch(reject);
    }), source.cancel];
};

export const makeRequest = (method, url, data, headers) => {
    return new Promise((resolve, reject) => {
        axios({
            url: appendSlash(BASE_URL + url),
            method: method,
            data: data,
            headers: _getHeaders(headers),
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
