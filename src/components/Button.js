import React, { forwardRef } from "react";
import useReactRouter from "../useReactRouter";

import "./Button.scss";


export const ButtonRow = ({ children, right }) => (
    <div className={"buttonRow" + (right ? " brRight" : "")}>{children}</div>
);

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
    if (props.main) className += " main";
    if (props.medium) className += " medium";
    if (props.lesser) className += " lesser";
    if (props.warning) className += " warning";
    if (props.disabled) className += " disabled";

    return <button className={className} disabled={props.disabled} ref={ref}
                   onMouseDown={props.to && (e => e.target.click())} onClick={onClick}>
        {props.children}
    </button>;
};


export default forwardRef(Button);
