import React, { useState, useEffect } from "react";

import Button from "./Button";

import "./TabbedView.scss";


export default ({ center, children, callback, initial }) => {
    const [active, setActive] = useState(initial || 0);

    useEffect(() => {
        if (callback) callback(active);
    });

    return (
        <>
            <div className={"buttonRow tabButtonRow" + (center ? " centre" : "")}>
                {children.map((c, i) =>
                    c && <Button key={i} click={(() => { active !== i && setActive(i) })} medium
                        className={i === active ? "active" : ""}>
                        {c.props.label}</Button>)}
            </div>
            <div className={"tabWrap"}>
                {children[active]}
            </div>
        </>
    )
}
