import React from 'react';
import ReactDOM from 'react-dom';
//import * as Sentry from '@sentry/browser';
import AppWrap from './containers/controllers/App';
import * as serviceWorker from './serviceWorker';
import { AppContainer } from 'react-hot-loader';
import Loadable from "react-loadable";
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import en from "./i18n/en.json";


//Sentry.init({dsn: "https://b51135cca11047fe979c7b44cc35a404@sentry.io/1815863"});
(r => r.keys().forEach(key => r(key).default()))(
    require.context("./plugins", true, /setup\.js$/)
);

i18next.init({
    interpolation: { escapeValue: false },
    lng: "not-en",
    resources: {
        en: {
            translation: en,
        },
    }
});

const render = () => {
    ReactDOM.render(
        <I18nextProvider i18n={i18next}>
            <AppContainer>
                <AppWrap />
            </AppContainer>
        </I18nextProvider>,
        document.getElementById("root")
    );
};

serviceWorker.register({
    onUpdate: registration => {
        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    }
});
Loadable.preloadAll();

render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./containers/controllers/App', () => {
        render();
    });
}
