import { useEffect } from "react";
import ReactGA from 'react-ga';

import { registerPlugin } from "ractf";
import { useReactRouter } from "@ractf/util";


const GA = () => {
    const { history } = useReactRouter();

    useEffect(() => {
        history.listen((location) => {
            ReactGA.set({ page: location.pathname });
            ReactGA.pageview(location.pathname);
        });
    }, [history]);

    return null;
};


export default () => {
    ReactGA.initialize('UA-126641600-2');
    ReactGA.pageview(window.location.pathname + window.location.search);

    registerPlugin("mountWithinApp", "googleAnalytics", { component: GA });
};
