import React, { forwardRef } from "react";
import { useReactRouter } from "@ractf/util";

import "./Button.scss";


const Button = (props, ref) => {
    const { history } = useReactRouter();

    const onClick = e => {
        if (props.click)
            props.click(e);
        if (props.form && props.form.callback)
            props.form.callback();
        if (props.to)
            history.push(props.to);
    };
    let className = props.className || "";
    if (props.large) className += " large";
    if (props.lesser) className += " lesser";
    if (props.warning) className += " warning";
    if (props.disabled) className += " disabled";

    return <button className={className} disabled={props.disabled} ref={ref}
                   onClick={onClick}>
        {props.children}
    </button>;
};


export default forwardRef(Button);
