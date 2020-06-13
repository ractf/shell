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

export default (history, asyncReducers) => combineReducers({
    router: connectRouter(history),

    preferences: preferencesReducer,
    challenges: challengesReducer,
    countdowns: countdownsReducer,
    websocket: websocketReducer,
    config: configReducer,
    token: tokenReducer,
    team: teamReducer,
    user: userReducer,
    ...asyncReducers
});
