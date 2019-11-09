import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

import "./Button.scss";


export const ButtonRow = ({ children }) => <div className={"buttonRow"}>{ children }</div>;

const Button = (props, ref) => {
    const clickFunc = () => {
        if (props.click)
            props.click();
        if (props.form && props.form.callback)
            props.form.callback();
    }
    let className = props.className || "";
    if (props.main) className += " main";
    if (props.medium) className += " medium";
    if (props.lesser) className += " lesser";
    if (props.warning) className += " warning";
    if (props.disabled) className += " disabled";

    const button = <button className={className} disabled={props.disabled} ref={ref} onMouseDown={props.to && (e => e.target.click())} onClick={clickFunc}>
        {props.children}
    </button>;

    if (props.to)
        return <Link to={props.to} onMouseDown={(e => e.target.click())}>
            {button}
        </Link>;
    return button;
};


export default forwardRef(Button);
