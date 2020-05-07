import React, { useState } from "react";

import { Button, FlexRow } from "@ractf/ui-kit";

import "./TabbedView.scss";


export const Tab = ({ label, children }) => children;

export default ({ center, children, callback, initial }) => {
    const [active, setActive] = useState(initial || 0);
    if (!children || children.constructor !== Array) children = [children];

    return (<>
        <FlexRow className={"tabButtonRow" + (center ? " centre" : "")}>
            {children.map((c, i) =>
                c && c.props.label ?
                    <Button key={i} click={(() => { if (active !== i) { setActive(i); callback && callback(i); } })}
                        className={i === active ? "active" : ""}>
                        {c.props.label}</Button>
                    : c)}
        </FlexRow>
        {children.map((i, n) =>
            <div key={n} style={{ display: n === active ? "block" : "none" }} className={"tabWrap"}>
                {i}
            </div>
        )}
    </>);
};
