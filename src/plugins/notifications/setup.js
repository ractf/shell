import { getLocalConfig, registerPlugin, registerReducer } from "ractf";
import { store } from "store";

import { notificationReducer } from "./reducers";
import AppNotifications from "./components/AppNotifications";
import * as actions from "./actions";
import { getUUID } from "@ractf/util";


const WS_CHALLENGE_SCORE = 1;
const WS_TEAM_FLAG_REJECT = 2;
const WS_TEAM_HINT_USE = 3;
const WS_TEAM_JOIN = 4;


export default () => {
    registerReducer("notifications", notificationReducer);

    registerPlugin("mountWithinApp", "notifications", {
        component: AppNotifications,
    });

    const addNotification = (title, body) => {
        const id = getUUID();
        store.dispatch(actions.showNotification({ id, title, body }));
        setTimeout(() => {
            store.dispatch(actions.hideNotification({ id }));
        }, 10000);
    };

    registerPlugin("wsMessage", WS_CHALLENGE_SCORE, (data) => {
        if (getLocalConfig("notifs.all_solves", undefined, true)) {
            addNotification("Challenge solved",
                `**${data.challenge_name}** was solved by ` +
                `**${data.username}** for **${data.team_name}**, ` +
                `scoring **${data.challenge_score}** points.`
            );
        }
    });

    registerPlugin("wsMessage", WS_TEAM_FLAG_REJECT, (data) => {
        // TODO: Hookup settings
        addNotification("Flag rejected",
            `**${data.username}** had a flag rejected for ` +
            `**${data.challenge_name}**.`
        );
    });

    registerPlugin("wsMessage", WS_TEAM_HINT_USE, (data) => {
        // TODO: Hookup settings
        addNotification("Hint used",
            `**${data.username}** used a hint for **${data.challenge}**, ` +
            `costing **${data.hint_penalty}** points.`
        );
    });

    registerPlugin("wsMessage", WS_TEAM_JOIN, (data) => {
        // TODO: Hookup settings
        addNotification("Team join", `**${data.username}** joined your team!`);
    });

};
