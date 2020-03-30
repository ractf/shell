import React from "react";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";

import { Link, fastClick } from "ractf";

import NodeLink from "./NodeLink";

import "./Node.scss";


export default ({
    name, unlocked, done, right, below, linksU, linksD, linksR, linksL, isEdit,
    click, toggleLink, largeName, orange, url, points
}) => {
    const toggle = side => {
        return e => {
            if (isEdit) {
                e.preventDefault();
                e.stopPropagation();
                toggleLink(side);
            }
        };
    };

    let nodeClass = "chalNode";
    if (largeName) nodeClass += " largeName";
    if (done) nodeClass += " done";
    if (unlocked) nodeClass += " unlocked";
    if (orange) nodeClass += " orange";

    let lockDoneR = done && right && right.solved;
    let lockDoneD = done && below && below.solved;

    let lockUnlockedR = ((done && right && !right.solved)
        || (!done && right && right.solved));
    let lockUnlockedD = ((done && below && !below.solved)
        || (!done && below && below.solved));

    let lockClassR = "lockRight";
    if (lockDoneR) lockClassR += " lockDoneR";
    if (lockUnlockedR) lockClassR += " lockUnlockedR";
    let lockClassD = "lockDown";
    if (lockDoneD) lockClassD += " lockDoneD";
    if (lockUnlockedD) lockClassD += " lockUnlockedD";

    let inner = <>
        <div>{name}</div>
        {unlocked &&
            <div className={"worth"}>{points}</div>
        }

        {linksR && <div className={lockClassR}>
            {lockDoneR ? <FaCheck /> : lockUnlockedR ? <FaLockOpen /> : <FaLock />}
        </div>}
        {linksD && <div className={lockClassD}>
            {lockDoneD ? <FaCheck /> : lockUnlockedD ? <FaLockOpen /> : <FaLock />}
        </div>}

        <NodeLink {...fastClick}
            onClick={toggle('left')} isEdit={isEdit} show={linksL} left
            done={done} unlocked={unlocked} />
        <NodeLink {...fastClick}
            onClick={toggle('right')} isEdit={isEdit} show={linksR} right
            done={done} unlocked={unlocked} />
        <NodeLink {...fastClick}
            onClick={toggle('up')} isEdit={isEdit} show={linksU} up
            done={done} unlocked={unlocked} />
        <NodeLink {...fastClick}
            onClick={toggle('down')} isEdit={isEdit} show={linksD} down
            done={done} unlocked={unlocked} />
    </>;

    if (isEdit || !url)
        return <div tabIndex={unlocked || done ? "0" : ""} {...fastClick}
            onClick={(done || unlocked) ? click : null} className={nodeClass}>
            {inner}
        </div>;

    return <Link tabIndex={unlocked || done ? "0" : ""} to={url} className={nodeClass}>
        {inner}
    </Link>;
};