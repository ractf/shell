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

import { prepareUrl, _getHeaders } from "./util";


export const abortableGet = (url, params) => {
    const controller = new AbortController();
    const { signal } = controller;

    return [
        fetch(prepareUrl(url, params), {
            method: "GET",
            headers: _getHeaders(),
            signal: signal
        }).then(res => res.json()).then(res => res.d),
        () => controller.abort()
    ];
};

export const makeRequest = (method, url, data, headers, params, multipart, onUploadProgress) => {
    let localHeaders = { ...headers };
    let localData = data;
    if (multipart) {
        localData = new FormData();
        Object.keys(data).forEach(i => {
            localData.append(i, data[i]);
        });
    } else {
        localData = JSON.stringify(data);
        localHeaders["Content-Type"] = "application/json;charset=UTF-8";
    }
    localHeaders = _getHeaders(localHeaders);

    // Fetch doesn't support upload progress, so XHR it is
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, prepareUrl(url, params));
        for (const k in localHeaders)
            xhr.setRequestHeader(k, localHeaders[k]);
        xhr.onreadystatechange  = event => {
            if (xhr.readyState === 4) {
                // I hate this line of code as much as you do
                if (Math.floor(xhr.status / 100) === 2) {
                    resolve(JSON.parse(event.target.responseText).d);
                } else if (xhr.status === 0) {
                    reject({ message: "Network request failed" });
                } else {
                    let data;
                    try {
                        data = JSON.parse(event.target.responseText);
                    } catch (e) {
                        data = event.target.responseText;
                    }
                    reject({
                        response: { data },
                        message: event.target.responseText ?? event.target.message
                    });
                }
            }
        };
        xhr.onerror = () => reject({ message: "Network request failed" });
        xhr.ontimeout = () => reject({ message: "Network request timed out" });
        if (xhr.upload && onUploadProgress)
            xhr.upload.onprogress = onUploadProgress;

        xhr.send(localData);
    });
};

export const get = makeRequest.bind(this, "GET");
export const post = makeRequest.bind(this, "POST");
export const put = makeRequest.bind(this, "PUT");
export const patch = makeRequest.bind(this, "PATCH");
export const delete_ = makeRequest.bind(this, "DELETE");
