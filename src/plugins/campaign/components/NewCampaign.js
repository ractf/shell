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

import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiUnlock, FiLock, FiEyeOff, FiCheck, FiMove, FiEdit2 } from "react-icons/fi";

import { Button, Column, UiKitModals } from "@ractf/ui-kit";
import { makeClass } from "@ractf/util";
import * as http from "@ractf/util/http";

import Link from "components/Link";
import { push } from "connected-react-router";

import style from "./NewCampaign.module.scss";


const emptyChallenge = (category, x, y) => ({
    lock: false,
    solve: false,
    unlocks: [],
    files: [],
    auto_unlock: true,
    challenge_type: "default",
    challenge_metadata: {
        x: x,
        y: y
    },
    category,
});

const clickBlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const Node = ({
    name, right, below, linksU, linksD, linksR, linksL, isEdit,
    onClick, url, x, y, challenge, startMove, startEdit,
    ...props
}) => {
    const { unlocked } = props;
    const { solved, solve_count, score } = challenge || {};
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
                {score}
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
export const AddNode = ({ text, ...props }) => <Node name={text} largeName orange unlocked {...props} />;

const TileLink = (props) => {
    const tileLinkClass = makeClass(
        style.tileLink,
        ...Object.keys(props).map(i => props[i] && style[i]).filter(Boolean)
    );

    return <div className={tileLinkClass} />;
};

const NodeRow = ({ children }) => (
    <div className={style.row}>
        <div>
            {children}
        </div>
    </div>
);

const MAX_WIDTH = 7;

const log = window.console.log.bind(window.console, "%c[Campaign]", "color: #d3d");

const automaticLayout = (width, height, challenges) => {
    const challenge_grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
    const off_grid = [];
    challenges.forEach(challenge => {
        const { x, y } = challenge.challenge_metadata;
        if ((typeof x) !== "undefined" && (typeof y) !== "undefined")
            challenge_grid[x][y] = challenge;
        else off_grid.push(challenge);
    });

    if (off_grid.length !== 0) {
        log("Preforming automatic layout");
        // Let the editing begin!
        off_grid.sort((a, b) => a.score - b.score).forEach(challenge => {
            for (let y = 0; ; y++) {
                for (let x = 0; x < MAX_WIDTH; x++) {
                    if (x >= challenge_grid.length)
                        challenge_grid.push([]);
                    if (y >= challenge_grid[x].length)
                        challenge_grid[x].push(null);

                    if (challenge_grid[x][y])
                        continue;
                    challenge_grid[x][y] = challenge;
                    log(`Placed ${challenge.id} at ${x},${y}`);
                    challenge.editMetadata({ x, y });
                    return;
                }
            }
        });
    }
};

export const Campaign = ({ category, isEdit, showLocked, showEditor }) => {
    const { challenges } = category;
    let width = Math.max(...challenges.map(i => i.challenge_metadata?.x || 0)) + 1;
    let height = Math.max(...challenges.map(i => i.challenge_metadata?.y || 0)) + 1;
    width = Math.max(1, width); height = Math.max(1, height);

    if (isEdit) {
        if (width < MAX_WIDTH)
            width++;
        height++;
    }

    const modals = useContext(UiKitModals);

    const challenge_grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
    const off_grid = [];
    challenges.forEach(challenge => {
        const { x, y } = challenge.challenge_metadata;
        if ((typeof x) !== "undefined" && (typeof y) !== "undefined")
            challenge_grid[x][y] = challenge;
        else off_grid.push(challenge);
    });

    // We absolutely must only call this once per category, as otherwise we will instantly
    // overwhelm the browser!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => automaticLayout(width, height, challenges), [
        category.id
    ]);

    const [selected, setSelected] = useState(null);

    const nodeMove = useCallback((challenge, x, y) => {
        if (!selected) {
            setSelected(oldSelected => {
                if (oldSelected && oldSelected[0] === x && oldSelected[1] === y)
                    return null;
                return [x, y, challenge];
            });
            return;
        }
        selected[2].editMetadata({ x, y }).catch(e => {
            modals.alert("Error moving challenge: " + http.getError(e));
        });
        challenge.editMetadata({ x: selected[0], y: selected[1] }).catch(e => {
            modals.alert("Error moving challenge: " + http.getError(e));
        });
        setSelected(null);
    }, [modals, selected]);
    const addNodeClick = useCallback((_, x, y) => {
        if (!selected) {
            showEditor(emptyChallenge(category, x, y), challenges, true)();
            return;
        };
        const challenge = selected[2];

        setSelected(null);
        challenge.editMetadata({ x, y }).catch(e => {
            modals.alert("Error moving challenge: " + http.getError(e));
        });
    }, [modals, selected, category, challenges, showEditor]);

    const dispatch = useDispatch();
    const nodeEdit = useCallback((challenge) => {
        dispatch(push(challenge.url + "#edit"));
    }, [dispatch]);

    const rows = [];
    for (let y = 0; y < height; y++) {
        const row = [];

        for (let x = 0; x < width; x++) {
            const challenge = challenge_grid[x][y];
            if (!challenge) {
                if (isEdit) {
                    row.push(
                        <AddNode text={selected ? "" : "+"} key={`add_${x}_${y}`} x={x} y={y} onClick={addNodeClick} />
                    );
                } else {
                    row.push(<div className={style.campaignSpacer} key={`spacer_${x}_${y}`} />);
                }
                continue;
            }

            const right = (challenge_grid[x + 1] || [])[y],
                left = (challenge_grid[x - 1] || [])[y],
                above = challenge_grid[x][y - 1],
                below = challenge_grid[x][y + 1];

            const linksR = (right && challenge.unlockedBy.indexOf(right.id) !== -1),
                linksL = (left && challenge.unlockedBy.indexOf(left.id) !== -1),
                linksU = (above && challenge.unlockedBy.indexOf(above.id) !== -1),
                linksD = (below && challenge.unlockedBy.indexOf(below.id) !== -1);

            const isSelected = selected && (selected[0] === x && selected[1] === y);
            const subdued = selected && (selected[0] === x && selected[1] === y);
            const unlocked = isEdit || (challenge.unlocked && !challenge.hidden) || challenge.solved;

            row.push(<Node
                challenge={challenge}
                key={`challenge_${challenge.id}`}
                solved={challenge.solved} unlocked={unlocked}
                hidden={!(isEdit || showLocked) && challenge.hidden}
                x={x} y={y}
                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}
                right={right} below={below}


                test={challenge.unlockedBy}

                onClick={selected && nodeMove}
                startEdit={nodeEdit}
                startMove={nodeMove}
                selected={isSelected}
                hasButtons={isEdit && !selected}
                hasHover={selected}
                subdued={subdued}
                isEdit={isEdit}

                url={((unlocked || showLocked) && !isEdit) ? challenge.url : null}

                name={
                    challenge.hidden && !(isEdit || showLocked) ? (
                        <FiEyeOff />
                    ) : !unlocked && !showLocked ? (
                        <FiLock />
                    ) : (
                        challenge.name
                    )
                }
            />);
        }

        rows.push(<NodeRow key={`row_${y}`} children={row} />);
    }

    return (
        <Column>
            {rows}
        </Column>
    );
};
export default React.memo(Campaign);
