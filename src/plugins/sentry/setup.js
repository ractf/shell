import * as Sentry from '@sentry/browser';

import { registerPlugin } from "ractf";


export default () => {
    let dsn = process.env.REACT_APP_SENTRY_DSN;
    if (dsn) {
        Sentry.init({dsn: dsn});

        registerPlugin("errorHandler", "sentry", (error, errorInfo) => {
            Sentry.captureException(error, { extra: errorInfo });
        });
    }
};
