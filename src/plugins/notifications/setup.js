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

import { getLocalConfig, getConfig } from "@ractf/shell-util";
import { registerPreferences, registerPlugin, registerReducer, registerMount } from "@ractf/plugins";
import { reloadAll, reloadTeam, incrementSolveCount } from "@ractf/api";
import { getUUID } from "@ractf/util";

import { store } from "store";

import { notificationReducer } from "./reducers";
import AppNotifications from "./components/AppNotifications";
import * as actions from "./actions";


const WS_CHALLENGE_SCORE = 1;
const WS_TEAM_FLAG_REJECT = 2;
const WS_TEAM_HINT_USE = 3;
const WS_TEAM_JOIN = 4;

export default () => {
    const solveBroadcastEnabled = getConfig("enable_solve_broadcast", true);

    registerReducer("notifications", notificationReducer);

    registerMount("app", "notifications", AppNotifications);
    registerPreferences([
        {name: "notifs.all_solves", initial: true},
        {name: "notifs.flag_reject", initial: true},
        {name: "notifs.hint_used", initial: true},
        {name: "notifs.team_join", initial: true},
    ]);

    const addNotification = (title, body) => {
        const id = getUUID();
        store.dispatch(actions.showNotification({ id, title, body }));
        setTimeout(() => {
            store.dispatch(actions.hideNotification({ id }));
        }, 10000);
    };

    registerPlugin("wsMessage", WS_CHALLENGE_SCORE, (data) => {
        if (solveBroadcastEnabled && getLocalConfig("notifs.all_solves", undefined, true)) {
            addNotification("Challenge solved",
                `**${data.challenge_name}** was solved by ` +
                `**${data.username}** for **${data.team_name}**, ` +
                `scoring **${data.challenge_score}** points.`
            );
        }

        incrementSolveCount(data.challenge_id, data.team_name);

        const teamId = store.getState().team?.id;
        const userId = store.getState().user?.id;
        if (data.team === teamId) {
            if (data.user !== userId)
                reloadAll();
            else
                reloadAll(false, true);
        }
    });

    registerPlugin("wsMessage", WS_TEAM_FLAG_REJECT, (data) => {
        if (getLocalConfig("notifs.flag_reject", undefined, true))
            addNotification("Flag rejected",
                `**${data.username}** had a flag rejected for ` +
                `**${data.challenge_name}**.`
            );
    });

    registerPlugin("wsMessage", WS_TEAM_HINT_USE, (data) => {
        if (getLocalConfig("notifs.hint_used", undefined, true))
            addNotification("Hint used",
                `**${data.username}** used a hint for **${data.challenge}**, ` +
                `with a **${data.hint_penalty}** point penalty.`
            );
        // Todo: Update the challenge with the used hint
    });

    registerPlugin("wsMessage", WS_TEAM_JOIN, (data) => {
        if (getLocalConfig("notifs.team_join", undefined, true))
            addNotification("Team join", `**${data.username}** joined your team!`);
        reloadTeam();
    });

};
