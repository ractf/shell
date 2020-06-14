import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { PERSIST, PURGE } from "redux-persist/es/constants";
import createReducer from "./reducers";
import localForage from 'localforage';

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
