import React from "react";

import "./NodeLink.scss";


export default props => {
    let className = "nodeLink";
    if (props.left) className += " left";
    if (props.right) className += " right";
    if (props.up) className += " up";
    if (props.down) className += " down";
    if (props.isEdit) className += " isEdit";
    if (props.unlocked) className += " unlocked";
    if (props.show) className += " show";
    if (props.done) className += " done";

    return <div onClick={props.onClick} onMouseDown={props.onMouseDown} className={className}/>;
};
