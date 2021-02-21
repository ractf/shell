import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { InnerTabs } from "@ractf/ui-kit";

import { push } from "connected-react-router";


const URLTabbedView = (props) => {
    const locationHash = useSelector(state => state.router?.location?.hash).split("#")[1];

    const dispatch = useDispatch();
    const setActive = (tab) => {
        dispatch(push(`#${tab}`));
    };

    return <InnerTabs  active={locationHash} setActive={setActive} {...props} />;
};
export default React.memo(URLTabbedView);
