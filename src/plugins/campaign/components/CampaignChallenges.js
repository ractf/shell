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

import React, { useState } from "react";
import { FaLock, FaEyeSlash } from "react-icons/fa";

import { linkChallenges } from "@ractf/api";

import { Node, AddNode } from "./Node";
import Row from "./Row";
import "./Spacer.scss";


const emptyChallenge = (challenges, x, y) => ({
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
    category: challenges,
});

export const CampaignChallenges = ({ challenges, showEditor, isEdit, showLocked }) => {
    const [reRender, setReRender] = useState(0);

    const chals = challenges.challenges || [];

    // Inflate the list of challenges into a 2d structure
    const rows = [];
    let maxX = 0;
    chals.forEach(chal => {
        const { x, y } = chal.challenge_metadata;
        while (rows.length <= y) rows.push([]);
        while (rows[y].length <= x) rows[y].push(null);

        if (rows[y][x]) console.log(`[WARN] Challenge stacking at ${x}-${y}!`, rows[y][x], chal);

        rows[y][x] = chal;
        if (x > maxX) maxX = x;
    });

    const toggleLink = chal => {
        const { x, y } = chal.challenge_metadata;
        return side => {
            let other;
            switch (side) {
                case "up":
                    other = (rows[y - 1] || [])[x];
                    break;
                case "down":
                    other = (rows[y + 1] || [])[x];
                    break;
                case "left":
                    other = rows[y][x - 1];
                    break;
                case "right":
                    other = rows[y][x + 1];
                    break;
                default:
                    break;
            }
            if (other) {
                linkChallenges(
                    chal, other,
                    chal.unlocks.indexOf(other.id) === -1
                );
                setReRender(reRender + 1);
            }
        };
    };

    if (isEdit) {
        if (maxX < 2) maxX++;
        rows.push([]);
    }
    rows.forEach(row => {
        while (row.length <= maxX) row.push(null);
    });

    // Convert the 2d structure into DOM elements
    const reactRows = rows.map((row, y) =>
        <Row key={y}>{row.map((chal, x) => {
            if (!chal) {
                if (isEdit)
                    return <AddNode onClick={showEditor(emptyChallenge(challenges, x, y), chals, true)}
                        key={"add_" + x + "," + y} />;
                return <div className={"campaignSpacer"} key={"spacer_" + x + "," + y} />;
            }

            // ( ... || []) ensures we have a list to lookup with [x].
            const right = rows[y][x + 1],
                left = rows[y][x - 1],
                above = (rows[y - 1] || [])[x],
                below = (rows[y + 1] || [])[x];

            const linksR = (right && chal.unlocks.indexOf(right.id) !== -1),
                linksL = (left && chal.unlocks.indexOf(left.id) !== -1),
                linksU = (above && chal.unlocks.indexOf(above.id) !== -1),
                linksD = (below && chal.unlocks.indexOf(below.id) !== -1);

            const unlocked = isEdit || (chal.unlocked && !chal.hidden) || chal.solved;

            return <Node
                key={chal.id} unlocked={unlocked || showLocked} hidden={!(isEdit || showLocked) && chal.hidden}
                done={!isEdit && chal.solved}

                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}

                right={right} below={below}

                isEdit={isEdit} toggleLink={toggleLink(chal)}
                points={chal.score}

                url={(isEdit || unlocked || showLocked) ? chal.url
                    + (isEdit ? "#edit" : "") : null}

                name={
                    chal.hidden && !(isEdit || showLocked) ? (
                        <FaEyeSlash />
                    ) : !unlocked && !showLocked ? (
                        <FaLock />
                    ) : (
                        chal.name
                    )
                }
            />;
        })}</Row>
    );

    return reactRows;

};
