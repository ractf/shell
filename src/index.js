import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/controllers/App';
import * as serviceWorker from './serviceWorker';
import setupPlugins from "./plugins";

import { AppContainer } from 'react-hot-loader';


setupPlugins();

const render = () => {
    ReactDOM.render(<AppContainer><App /></AppContainer>, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

render();

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/controllers/App', () => {
    render();
  });
}
