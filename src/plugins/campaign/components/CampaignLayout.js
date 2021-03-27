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
import { FiLock, FiEyeOff } from "react-icons/fi";

import { Column, UiKitModals } from "@ractf/ui-kit";
import * as http from "@ractf/util/http";

import { push } from "connected-react-router";

import { MAX_WIDTH, automaticLayout, emptyChallenge } from "./util";
import { Tile, AddTile, TileRow } from "./Tile";
import style from "./NewCampaign.module.scss";


const CampaignLayout = ({ challenges: category, isEdit, showLocked, showEditor }) => {
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

    const tileMove = useCallback((challenge, x, y) => {
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
    const addTileClick = useCallback((_, x, y) => {
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
    const tileEdit = useCallback((challenge) => {
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
                        <AddTile text={selected ? "" : "+"} key={`add_${x}_${y}`} x={x} y={y} onClick={addTileClick} />
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

            row.push(<Tile
                challenge={challenge}
                key={`challenge_${challenge.id}`}
                solved={challenge.solved} unlocked={unlocked}
                hidden={!(isEdit || showLocked) && challenge.hidden}
                x={x} y={y}
                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}
                right={right} below={below}


                test={challenge.unlockedBy}

                onClick={selected && tileMove}
                startEdit={tileEdit}
                startMove={tileMove}
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

        rows.push(<TileRow key={`row_${y}`} children={row} />);
    }

    return (
        <Column>
            {rows}
        </Column>
    );
};
export default React.memo(CampaignLayout);
