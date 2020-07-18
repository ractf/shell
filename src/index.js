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

import "promise-polyfill/src/polyfill";

import React from "react";
import i18next from "i18next";
import ReactDOM from "react-dom";
//import Loadable from "react-loadable";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppContainer } from "react-hot-loader";
import * as serviceWorker from "./serviceWorker";
import { I18nextProvider } from "react-i18next";

import AppWrap from "./controllers/App";
import { store, persistor } from "store";

import en from "./i18n/en.json";

(r => r.keys().forEach(key => r(key).default()))(
    require.context("./plugins", true, /setup\.js$/)
);

/* Enable or disable service workers.
 * Setting this value to true will store a copy of RACTF in players' browsers
 *  which allows the site to operate offline and can make it load slightly
 *  faster after the initial load. See README.md for more details, and why you
 *  might not want this enabled in some cases.
 */
const ENABLE_SERVICE_WORKER = true;

const gft = i18next.getFixedT.bind(i18next);
i18next.getFixedT = (lng, ns) => {
    const t = gft(lng, ns);
    
    const fixedT = (key, opts, ...rest) => {
        const tl = t(key, opts, ...rest);
        if (tl === key)
            return <span style={{background: "#3a3"}}>{tl}</span>;
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
