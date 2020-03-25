import React, { Component } from "react";

import { WSContext } from "./Contexts";


export default class WS extends Component {
    WSS_URL = process.env.REACT_APP_WSS_URL;

    CONNECTION = 0;
    CHALLENGE_SCORE = 1;

    constructor(props) {
        super(props);
        this.api = this.props.api;
        this.api._loginCallback = this._loginCallback;

        setInterval((() => {
            if (!this.state.connected)
                this.setState({
                    timer: this.state.timer - 1
                });
        }), 1000);

        this.state = {
            connected: false,
            cooldown: 1000,
            timer: 1,
        };
        this._setupWS();

        window.__ws = this;
    }

    log = window.console.log.bind(window.console, "%c[Websocket]", "color: #d3d");

    _loginCallback = (token) => {
        token = token || localStorage.getItem("token");
        if (token && this.ws.readyState === WebSocket.OPEN)
            this.send({token: token});
    };

    send = (data) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
            return this.log("Error: Failed to send WS message: Not open.", data);
        this.ws.send(JSON.stringify(data));
    }

    _setupWS = () => {
        try {
            this.ws = new WebSocket(this.WSS_URL);
        } catch(e) {
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
        this.log("OPEN");
        this.setState({
            cooldown: 1000,
            timer: 1,
            connected: true
        });
        this._loginCallback();
    };

    onmessage = message => {
        let data = JSON.parse(message.data);

        switch (data.event_code) {
            case this.CONNECTION:
                this.log(data.message);
                break;
            case this.CHALLENGE_SCORE:
                this.log(data);
                this.api.addPopup(
                    "Challenge solved",
                    <>
                        <b>{data.challenge_name}</b> was solved by <b>
                            {data.username}</b> for <b>
                            {data.team_name}</b> scoring <b>
                            {data.challenge_score}</b> points
                    </>
                );
                break;
            default:
                break;
        }
    };

    onerror = (e) => {
        this.log("Error:", e);
    };

    onclose = () => {
        this.log("CLOSE");
        let cooldown = Math.min(16000, this.state.cooldown * 2);
        setTimeout(this._setupWS, cooldown);
        this.setState({
            connected: false,
            cooldown: cooldown,
            timer: cooldown / 1000
        });
    };

    render() {
        return <WSContext.Provider value={this.state}>
            {this.props.children}
        </WSContext.Provider>;
    }
}
