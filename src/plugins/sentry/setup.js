import * as Sentry from '@sentry/browser';

export default () => {
    let dsn = process.env.REACT_APP_SENTRY_DSN;
    if (dsn) Sentry.init({dsn: dsn});
};
