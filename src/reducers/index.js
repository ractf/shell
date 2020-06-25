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

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import preferencesReducer from "./preferencesReducer";
import challengesReducer from "./challengesReducer";
import countdownsReducer from "./countdownsReducer";
import websocketReducer from "./websocketReducer";
import configReducer from "./configReducer";
import tokenReducer from "./tokenReducer";
import teamReducer from "./teamReducer";
import userReducer from "./userReducer";

const mergeReducers = (...reducers) => {
    return (state, action) => {
        let nextState = { ...state };
        for (const reducer of reducers) {
            if (reducer)
                nextState = reducer(nextState, action);
        }
        if (nextState !== state) return nextState;
        return state;
    };
};

export default (history, asyncReducers) => mergeReducers(combineReducers({
    router: connectRouter(history),

    preferences: preferencesReducer,
    challenges: challengesReducer,
    countdowns: countdownsReducer,
    websocket: websocketReducer,
    config: configReducer,
    token: tokenReducer,
    team: teamReducer,
    user: userReducer,
    ...(asyncReducers ? asyncReducers.named : {})
}), ...(asyncReducers ? asyncReducers.anon : []));
