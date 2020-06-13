import React from "react";
import i18next from "i18next";
import ReactDOM from "react-dom";
import Loadable from "react-loadable";
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

serviceWorker.register({
    onUpdate: registration => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
    }
});
Loadable.preloadAll();

render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept("./controllers/App", () => {
        render();
    });
}
