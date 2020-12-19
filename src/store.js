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

import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import createReducer from "./reducers";
import storage from "redux-persist/lib/storage";

export const history = createBrowserHistory();

const persistConfig = {
    key: "root",
    storage: storage,
};

const middleware = [
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
window.__ractf_store = store;
store.asyncReducers = { named: {}, anon: [] };
const injectReducer = (store, name, asyncReducer) => {
    if (name)
        store.asyncReducers.named[name] = asyncReducer;
    else
        store.asyncReducers.anon.push(asyncReducer);
    store.replaceReducer(persistReducer(persistConfig, createReducer(history, store.asyncReducers)));
    persistor.persist();
};
const persistor = persistStore(store);
export { store, persistor, injectReducer };
