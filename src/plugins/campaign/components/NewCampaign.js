import React, { useState, useCallback } from "react";
import { Card, Column } from "@ractf/ui-kit";
import Link from "components/Link";

import { FiUnlock, FiLock, FiEyeOff, FiCheck } from "react-icons/fi";


import style from "./NewCampaign.module.scss";
import { makeClass } from "@ractf/util";
import { appContext } from "ractf";
import { useContext } from "react";
import http from "@ractf/http";
import { useEffect } from "react";


const Node = ({
    name, right, below, linksU, linksD, linksR, linksL, isEdit,
    onClick, toggleLink, url, x, y, challenge, ...props
}) => {
    const { unlocked } = props;
    const { solved, score } = challenge || {};
    const toggle = side => {
        return e => {
            if (isEdit) {
                e.preventDefault();
                e.stopPropagation();
                toggleLink(side);
            }
        };
    };

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

    const inner = <Card>
        <div className={style.name}>{name}</div>
        {unlocked &&
            <div className={style.points}>{score}</div>
        }

        {linksR && <div className={makeClass(style.lock, style.right)}>
            {solvedRight ? <FiCheck /> : unlockedRight ? <FiUnlock /> : <FiLock />}
        </div>}
        {linksD && <div className={makeClass(style.lock, style.down)}>
            {solvedDown ? <FiCheck /> : unlockedDown ? <FiUnlock /> : <FiLock />}
        </div>}

        <TileLink
            onClick={toggle("left")} isEdit={isEdit} show={linksL} left
            solved={solved} unlocked={unlocked} />
        <TileLink
            onClick={toggle("right")} isEdit={isEdit} show={linksR} right
            solved={solved} unlocked={unlocked} />
        <TileLink
            onClick={toggle("up")} isEdit={isEdit} show={linksU} up
            solved={solved} unlocked={unlocked} />
        <TileLink
            onClick={toggle("down")} isEdit={isEdit} show={linksD} down
            solved={solved} unlocked={unlocked} />
    </Card>;

    const myClick = useCallback(() => {
        if ((solved || unlocked) && onClick)
            onClick(challenge, x, y);
    }, [solved, unlocked, onClick, challenge, x, y]);

    if (!url)
        return <div tabIndex={unlocked || solved ? "0" : ""}
            onClick={myClick} className={tileClass}>
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

    return <div onClick={props.onClick} onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart} className={tileLinkClass} />;
};

const NodeRow = ({ children }) => (
    <div className={style.row}>
        <div>
            {children}
        </div>
    </div>
);


const MAX_WIDTH = 3;

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

export const Campaign = ({ category, isEdit, showLocked }) => {
    const { challenges } = category;
    let width = Math.max(...challenges.map(i => i.challenge_metadata?.x || 0)) + 1;
    let height = Math.max(...challenges.map(i => i.challenge_metadata?.y || 0)) + 1;
    width = Math.max(1, width); height = Math.max(1, height);

    if (isEdit) {
        width = MAX_WIDTH;
        height++;
    }

    const app = useContext(appContext);

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

    const nodeClick = useCallback((challenge, x, y) => {
        setSelected(oldSelected => {
            if (oldSelected && oldSelected[0] === x && oldSelected[1] === y)
                return null;
            return [x, y, challenge];
        });
    }, []);
    const addNodeClick = useCallback((_, x, y) => {
        if (!selected) return;
        const challenge = selected[2];

        // Don't wait for completion to make it feel a little faster
        setSelected(null);
        challenge.editMetadata({ x, y }).catch(e => {
            app.alert("Error moving challenge: " + http.getError(e));
        });
    }, [app, selected]);

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

            const adjacent = [
                [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
            ].filter(([x, y]) => (x >= 0 && y >= 0 && x < width && y < height));

            const has_broken_link = !challenge.unlocks.map(unlocks => {
                unlocks = category.challenges.filter(i => i.id === unlocks)[0];
                if (!unlocks)
                    return false;

                let { x: ux, y: uy } = unlocks.challenge_metadata;
                ux = parseInt(ux, 10); uy = parseInt(uy, 10);
                // Handle non-campaign challenges (e.g. after conversion)
                if (isNaN(ux)) ux = -1; if (isNaN(uy)) uy = -1;

                // Check if [ux, uy] in adjacent
                return adjacent.map(([ax, ay]) => (ax === ux && ay === uy)).reduce((a, b) => a || b);
            }).reduce((a, b) => a && b, true);

            const right = (challenge_grid[x + 1] || [])[y],
                left = (challenge_grid[x - 1] || [])[y],
                above = challenge_grid[x][y - 1],
                below = challenge_grid[x][y + 1];

            const linksR = (right && challenge.unlocks.indexOf(right.id) !== -1),
                linksL = (left && challenge.unlocks.indexOf(left.id) !== -1),
                linksU = (above && challenge.unlocks.indexOf(above.id) !== -1),
                linksD = (below && challenge.unlocks.indexOf(below.id) !== -1);

            const isSelected = selected && (selected[0] === x && selected[1] === y);
            const subdued = selected && (selected[0] !== x || selected[1] !== y);
            const unlocked = isEdit || (challenge.unlocked && !challenge.hidden) || challenge.solved;

            row.push(<Node
                challenge={challenge}
                key={`challenge_${challenge.id}`}
                solved={challenge.solved} unlocked={unlocked && !subdued}
                hidden={!(isEdit || showLocked) && challenge.hidden}
                x={x} y={y}
                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}
                right={right} below={below}
                warning={has_broken_link}

                onClick={isEdit && nodeClick}
                selected={isSelected}
                subdued={subdued}

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
