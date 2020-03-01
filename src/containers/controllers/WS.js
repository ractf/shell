import React, { Component } from "react";

import { WSContext } from "./Contexts";


export default class WS extends Component {
    WSS_URL = process.env.REACT_APP_WSS_URL;

    CONNECTION = 0;
    CHALLENGE_SCORE = 1;

    constructor(props) {
        super(props);
        this.api = this.props.api;

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
    }

    _setupWS = () => {
        this.ws = new WebSocket(this.WSS_URL);

        this.ws.onopen = this.onopen;
        this.ws.onmessage = this.onmessage;
        this.ws.onerror = this.onerror;
        this.ws.onclose = this.onclose;
    }

    onopen = () => {
        console.log("OPEN")
        this.setState({
            cooldown: 1000,
            timer: 1,
            connected: true
        });
    };

    onmessage = message => {
        let data = JSON.parse(message.data);

        switch (data.event_code) {
            case this.CONNECTION:
                console.log(data.message);
                break;
            case this.CHALLENGE_SCORE:
                console.log(data);
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
        throw e;
    };

    onclose = () => {
        console.log("close")
        let cooldown = Math.min(16000, this.cooldown * 2);
        setTimeout(this._setupWS, cooldown);
        this.setState({
            connected: false,
            cooldown: cooldown,
            timer: cooldown / 1000
        });
    };

    render() {
        return <WSContext.Provider value={this.state}>{this.props.children}</WSContext.Provider>;
    }
}
