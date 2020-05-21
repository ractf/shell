import { useEffect } from "react";
import ReactGA from 'react-ga';

import { registerPlugin } from "ractf";
import { useReactRouter } from "@ractf/util";


export const UA = process.env.REACT_APP_GA_UA;


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
    if (UA) {
        ReactGA.initialize(UA);
        ReactGA.pageview(window.location.pathname + window.location.search);

        registerPlugin("mountWithinApp", "googleAnalytics", { component: GA });
    }
};
