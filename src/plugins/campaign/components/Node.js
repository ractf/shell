// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";

import Link from "components/Link";

import NodeLink from "./NodeLink";

//import "./Node.scss";


export const Node = ({
    name, unlocked, done, right, below, linksU, linksD, linksR, linksL, isEdit,
    onClick, toggleLink, largeName, orange, url, points, hidden
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
    if (done && !hidden) nodeClass += " done";
    if (unlocked && !hidden) nodeClass += " unlocked";
    if (orange) nodeClass += " orange";

    const lockDoneR = done && right && right.solved;
    const lockDoneD = done && below && below.solved;

    const lockUnlockedR = ((done && right && !right.solved)
        || (!done && right && right.solved));
    const lockUnlockedD = ((done && below && !below.solved)
        || (!done && below && below.solved));

    let lockClassR = "lockRight";
    if (lockDoneR) lockClassR += " lockDoneR";
    if (lockUnlockedR) lockClassR += " lockUnlockedR";
    let lockClassD = "lockDown";
    if (lockDoneD) lockClassD += " lockDoneD";
    if (lockUnlockedD) lockClassD += " lockUnlockedD";

    const inner = <>
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

        <NodeLink
            onClick={toggle("left")} isEdit={isEdit} show={linksL} left
            done={done} unlocked={unlocked} />
        <NodeLink
            onClick={toggle("right")} isEdit={isEdit} show={linksR} right
            done={done} unlocked={unlocked} />
        <NodeLink
            onClick={toggle("up")} isEdit={isEdit} show={linksU} up
            done={done} unlocked={unlocked} />
        <NodeLink
            onClick={toggle("down")} isEdit={isEdit} show={linksD} down
            done={done} unlocked={unlocked} />
    </>;

    if (!url)
        return <div tabIndex={unlocked || done ? "0" : ""}
            onClick={(done || unlocked) ? onClick : null} className={nodeClass}>
            {inner}
        </div>;

    return <Link tabIndex={unlocked || done ? "0" : ""} to={url} className={nodeClass}>
        {inner}
    </Link>;
};
export const AddNode = props => <Node name="+" largeName orange unlocked {...props} />;
