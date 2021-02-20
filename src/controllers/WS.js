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

import { registerPlugin } from "@ractf/plugins";
import { getPlugin } from "@ractf/plugins";

import * as actions from "actions";
import { store } from "store";


export default class WS {
    WSS_URL = window.env.wssUrl;

    CONNECTION = 0;

    constructor() {
        registerPlugin("postLogin", "webSocket", this._loginCallback);

        setInterval((() => {
            const state = store.getState().websocket || {};
            if (!state.connected)
                store.dispatch(actions.decrementWSTimer());
        }), 1000);

        this._setupWS();

        window.__ws = this;
    }

    log = window.console.log.bind(window.console, "%c[Websocket]", "color: #d3d");

    _loginCallback = (token) => {
        if (!token)
            token = store.getState().token?.token;
        if (token && this.ws.readyState === WebSocket.OPEN)
            this.send({ token: token });
    };

    send = (data) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
            return this.log("Error: Failed to send WS message: Not open.", data);
        this.ws.send(JSON.stringify(data));
    }

    _setupWS = () => {
        try {
            this.ws = new WebSocket(this.WSS_URL);
        } catch (e) {
            this.ws = null;
            this.onclose();
            return;
        }

        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onerror = this.onerror;
        this.ws.onclose = this.onclose;
    };

    onopen = () => {
        store.dispatch(actions.setWebsocket({
            cooldown: 1000,
            timer: 1,
            connected: true
        }));
        this._loginCallback();
    };

    onmessage = message => {
        const data = JSON.parse(message.data);

        const plugin = getPlugin("wsMessage", data.event_code);
        if (plugin)
            plugin(data);

        switch (data.event_code) {
            case this.CONNECTION:
                this.log(data.message);
                break;
            default:
                this.log(data);
                break;
        }
    };

    onerror = (e) => {
        this.log("Error:", e);
    };

    onclose = () => {
        this.log("CLOSE");
        const state = store.getState().websocket || {};
        const cooldown = Math.min(16000, state.cooldown * 2);
        setTimeout(this._setupWS, cooldown);
        store.dispatch(actions.setWebsocket({
            connected: false,
            cooldown: cooldown,
            timer: cooldown / 1000
        }));
    };
}
