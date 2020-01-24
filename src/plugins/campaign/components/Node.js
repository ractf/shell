import React from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";

import NodeLink from "./NodeLink";

import "./Node.scss";


export default props => {
    const toggle = side => {
        return e => {
            if (props.isEdit) {
                e.preventDefault();
                e.stopPropagation();
                props.toggleLink(side);
            }
        };
    };

    let nodeClass = "chalNode";
    if (props.largeName) nodeClass += " largeName";
    if (props.done) nodeClass += " done";
    if (props.unlocked) nodeClass += " unlocked";
    if (props.orange) nodeClass += " orange";

    let lockClassR = "lockRight";
    if (props.lockDoneR) lockClassR += " lockDoneR";
    if (props.lockDoneR) lockClassR += " lockUnlockedR";
    let lockClassD = "lockDown";
    if (props.lockDoneD) lockClassD += " lockDoneD";
    if (props.lockDoneD) lockClassD += " lockUnlockedD";

    let inner = <>
        <div>{props.name}</div>

        {props.right && <div className={lockClassR}>{props.lockDoneR ? <FaCheck /> : props.lockUnlockedR ? <FaLockOpen /> : <FaLock />}</div>}
        {props.down && <div className={lockClassD}>{props.lockDoneD ? <FaCheck /> : props.lockUnlockedD ? <FaLockOpen /> : <FaLock />}</div>}

        <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('left')} isEdit={props.isEdit} show={props.left} left done={props.done} unlocked={props.unlocked} />
        <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('right')} isEdit={props.isEdit} show={props.right} right done={props.done} unlocked={props.unlocked} />
        <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('up')} isEdit={props.isEdit} show={props.up} up done={props.done} unlocked={props.unlocked} />
        <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('down')} isEdit={props.isEdit} show={props.down} down done={props.done} unlocked={props.unlocked} />
    </>;

    if (props.isEdit)
        return <div tabIndex={props.unlocked || props.done ? "0" : ""} onMouseDown={(e => (e.target.click && e.target.click()))} onClick={(props.done || props.unlocked) ? props.click : null} className={nodeClass}>
            { inner }
        </div>;

    return <Link tabIndex={props.unlocked || props.done ? "0" : ""} to={props.url} className={nodeClass}>
        { inner }
    </Link>;
        
};