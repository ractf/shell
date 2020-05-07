import React from "react";
import { useReactRouter } from "@ractf/util";

import { Page } from "@ractf/ui-kit";
import { plugins } from "ractf";


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
