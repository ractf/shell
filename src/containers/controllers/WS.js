import React from "react";


export default class WS {
    WSS_URL = process.env.REACT_APP_WSS_URL;

    CONNECTION = 0;
    CHALLENGE_SCORE = 1;

    constructor(api) {
        this.api = api;
        this.connected = false;
        this.cooldown = 1000;
        this.timer = this.cooldown / 1000;

        setInterval((() => {
            this.timer -= 1;
            if (!this.connected)
                api.refresh();
        }), 1000);

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
        this.cooldown = 1000;
        this.timer = this.cooldown / 1000;
        this.connected = true;
        this.api.refresh();
    };

    onmessage = message => {
        let data = JSON.parse(message.data);

        switch (data.event_code) {
            case this.CONNECTION:
                console.log(data.message)
                break;
            case this.CHALLENGE_SCORE:
                console.log(data);
                this.api.addPopup(
                    "Challenge solved",
                    <>
                        <b>{data.data.challenge_name}</b> was solved by <b>
                            {data.data.user_name}</b> for <b>
                            {data.data.team_name}</b> scoring <b>
                            {data.data.challenge_score}</b> points
                    </>
                )
                break;
            default:
                break;
        }
    };

    onerror = () => {

    };

    onclose = () => {
        this.connected = false;
        setTimeout(this._setupWS, this.cooldown);
        this.cooldown = Math.min(16000, this.cooldown * 2);
        this.timer = this.cooldown / 1000;
        this.api.refresh();
    };
}
