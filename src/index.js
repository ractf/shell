import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import AppWrap from './containers/controllers/App';
import * as serviceWorker from './serviceWorker';
import setupPlugins from "./plugins";
import { AppContainer } from 'react-hot-loader';

Sentry.init({dsn: "https://b51135cca11047fe979c7b44cc35a404@sentry.io/1815863"});
setupPlugins();

const render = () => {
    ReactDOM.render(<AppContainer><AppWrap /></AppContainer>, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

render();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/controllers/App', () => {
    render();
  });
}
