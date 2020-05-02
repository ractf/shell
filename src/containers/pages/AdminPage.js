import React from "react";
import useReactRouter from "../../useReactRouter";

import {Page, plugins,} from "ractf";


export default () => {
    const { match } = useReactRouter();
    if (!match) return null;
    const page = match.params.page;

    let content;
    if (plugins.adminPage && plugins.adminPage[page]) {
        content = React.createElement(plugins.adminPage[page].component);
    }

    return <Page selfContained>
        {content}
    </Page>;
};
