import { api, http } from "ractf";
import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";


export const recheckCountdowns = (old) => {
    const oldCountdown = store.getState().countdowns;
    if (!oldCountdown) return;
    
    const countdown = {
        ...(old || oldCountdown),
        passed: {},
    };
    // This double negative is intentional.
    // If "+" is used, JS concatinates the int to the date as a string.
    const now = (new Date()) - (-countdown.offset);
    let changed = false;
    Object.entries(countdown.dates).forEach(([key, value]) => {
        countdown.passed[key] = value - now < 0;
        if (countdown.passed[key] !== oldCountdown.passed[key])
            changed = true;
    });
    if (old) return countdown;
    if (changed) api.getChallenges();

    store.dispatch(actions.setCountdowns(countdown));
};

export const getCountdown = () => http.get(ENDPOINTS.COUNTDOWN).then(data => {
    const serverTime = new Date(data.server_timestamp);
    const offset = serverTime - (new Date());

    const countdown = {
        offset: offset,
        dates: {},
        passed: {},
    };
    Object.entries(data).forEach(([key, value]) => {
        if (key === "server_timestamp") return;
        countdown.dates[key] = new Date(value * 1000) - offset;
        countdown.passed[key] = countdown.dates[key] - serverTime < 0;
    });

    //let ct = new Date(data.countdown_timestamp * 1000);

    //let countdown = { time: ct, offset: st - now };
    store.dispatch(actions.setCountdowns(countdown));
});
