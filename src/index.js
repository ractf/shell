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

import "promise-polyfill/src/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";
import { I18nextProvider } from "react-i18next";

import * as http from "@ractf/util/http";

import i18next from "i18next";
import { store, persistor } from "store";
import { PersistGate } from "redux-persist/integration/react";

import AppWrap from "./controllers/App";
import * as serviceWorker from "./serviceWorker";
import en from "./i18n/en.json";

import "@ractf/ui-kit/Base.scss";


const DOMAIN = window.env.apiDomain;
const API_BASE = window.env.apiBase;
const BASE_URL = DOMAIN + API_BASE;
http.setConfig({
    base: BASE_URL,
    getHeaders: () => {
        const token = store.getState().token?.token;
        if (token)
            return { Authorization: `Token ${token}` };
        return {};
    },
    getTranslation: str => i18next.t(str),
});

(r => r.keys().forEach(key => r(key).default()))(
    require.context("./plugins", true, __PLUGIN_REGEX__)
);

/* Enable or disable service workers.
 * Setting this value to true will store a copy of RACTF in players' browsers
 *  which allows the site to operate offline and can make it load slightly
 *  faster after the initial load. See README.md for more details, and why you
 *  might not want this enabled in some cases.
 */
const ENABLE_SERVICE_WORKER = false;

const gft = i18next.getFixedT.bind(i18next);
i18next.getFixedT = (lng, ns) => {
    const t = gft(lng, ns);

    const fixedT = (key, opts, ...rest) => {
        const tl = t(key, opts, ...rest);
        if (tl === key)
            return <span style={{ background: "#3a3" }}>{tl}</span>;
        return tl;
    };
    fixedT.lng = t.lng;
    fixedT.ns = t.ns;
    return fixedT;
};

i18next.init({
    interpolation: { escapeValue: false },
    lng: "en",
    resources: {
        en: {
            translation: en,
        },
    }
});

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <I18nextProvider i18n={i18next}>
                    <AppContainer>
                        <AppWrap />
                    </AppContainer>
                </I18nextProvider>
            </PersistGate>
        </Provider>,
        document.getElementById("root")
    );
};

if (ENABLE_SERVICE_WORKER)
    serviceWorker.register({
        onUpdate: registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }
            window.location.reload();
        }
    });
else if (serviceWorker)
    serviceWorker.unregister();
//Loadable.preloadAll();

render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept("./controllers/App", () => {
        render();
    });
}
