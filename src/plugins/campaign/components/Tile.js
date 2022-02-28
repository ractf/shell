// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiUnlock, FiLock, FiCheck, FiMove, FiEdit2 } from "react-icons/fi";

import { Button } from "@ractf/ui-kit";
import { makeClass } from "@ractf/util";

import Link from "components/Link";

import { clickBlock } from "./util";
import style from "./NewCampaign.module.scss";


const TileLink = (props) => {
    const tileLinkClass = makeClass(
        style.tileLink,
        ...Object.keys(props).map(i => props[i] && style[i]).filter(Boolean)
    );

    return <div className={tileLinkClass} />;
};

export const Tile = ({
    name, right, below, linksU, linksD, linksR, linksL, isEdit,
    onClick, url, x, y, challenge, startMove, startEdit,
    ...props
}) => {
    const { unlocked } = props;
    const { solved, solve_count, score, current_score } = challenge || {};
    const { t } = useTranslation();

    const solvedRight = solved && right && right.solved;
    const solvedDown = solved && below && below.solved;

    const unlockedRight = ((solved && right && !right.solved)
        || (!solved && right && right.solved));
    const unlockedDown = ((solved && below && !below.solved)
        || (!solved && below && below.solved));

    const classes = {
        ...props, solved, unlocked,
        solvedRight, unlockedRight, solvedDown, unlockedDown
    };
    const tileClass = makeClass(
        style.tile,
        ...Object.keys(classes).map(i => classes[i] && style[i]).filter(Boolean)
    );
    const doStartMove = useCallback(() => {
        startMove(challenge, x, y);
    }, [startMove, challenge, x, y]);
    const doStartEdit = useCallback(() => {
        startEdit(challenge);
    }, [startEdit, challenge]);

    const inner = <>
        <div className={style.hoverTarget} />
        <div className={style.name}>{name}</div>
        {unlocked && (typeof score === "number") &&
            <div className={style.points}>
                {current_score ?? score}
                <div className={style.subLabel}>{t("point", { count: score })}</div>
            </div>
        }
        {unlocked && (typeof solve_count === "number") &&
            <div className={style.solves}>
                {solve_count}
                <div className={style.subLabel}>{t("solve", { count: solve_count })}</div>
            </div>
        }

        {linksR && <div className={makeClass(style.lock, style.right)}>
            {solvedRight ? <FiCheck /> : unlockedRight ? <FiUnlock /> : <FiLock />}
        </div>}
        {linksD && <div className={makeClass(style.lock, style.down)}>
            {solvedDown ? <FiCheck /> : unlockedDown ? <FiUnlock /> : <FiLock />}
        </div>}

        <TileLink show={linksL} left solved={solved} unlocked={unlocked} />
        <TileLink show={linksR} right solved={solved} unlocked={unlocked} />
        <TileLink show={linksU} up solved={solved} unlocked={unlocked} />
        <TileLink show={linksD} down solved={solved} unlocked={unlocked} />

        <div className={style.buttons} onClick={clickBlock}>
            <Button success onClick={doStartMove} Icon={FiMove} />
            <Button warning onClick={doStartEdit} Icon={FiEdit2} />
        </div>
    </>;

    const myClick = useCallback(() => {
        if ((solved || unlocked) && onClick)
            onClick(challenge, x, y);
    }, [solved, unlocked, onClick, challenge, x, y]);

    if (!url)
        return <div tabIndex={unlocked || solved ? "0" : ""}
            onMouseDown={myClick} className={tileClass}>
            {inner}
        </div>;

    return <Link tabIndex={unlocked || solved ? "0" : ""} to={url} className={tileClass}>
        {inner}
    </Link>;
};

export const AddTile = ({ text, ...props }) => (
    <Tile name={text} largeName orange unlocked {...props} />
);

export const TileRow = ({ children }) => (
    <div className={style.row}>
        <div>
            {children}
        </div>
    </div>
);
