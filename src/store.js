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

import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { PERSIST, PURGE } from "redux-persist/es/constants";
import createReducer from "./reducers";
import localForage from "localforage";

export const history = createBrowserHistory();

const syncConfig = {
    blacklist: [PERSIST, PURGE],
};
const persistConfig = {
    key: "root",
    storage: localForage,
};

const middleware = [
    createStateSyncMiddleware(syncConfig),
    routerMiddleware(history)
];

const persistedReducer = persistReducer(persistConfig, createReducer(history));

const appliedMiddleware = applyMiddleware(...middleware);
const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? compose(appliedMiddleware, window.__REDUX_DEVTOOLS_EXTENSION__())
        : appliedMiddleware,
);
store.asyncReducers = {};
const injectReducer = (store, name, asyncReducer) => {
    store.asyncReducers[name] = asyncReducer;
    store.replaceReducer(persistReducer(persistConfig, createReducer(history, store.asyncReducers)));
};
const persistor = persistStore(store);
initMessageListener(store);
export { store, persistor, injectReducer };
