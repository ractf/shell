import React, { useState } from "react";
import { FaLock, FaEyeSlash } from "react-icons/fa";

import { api } from "ractf";

import { Node, AddNode } from "./Node";
import Row from "./Row";
import "./Spacer.scss";


const emptyChallenge = (x, y) => ({
    lock: false,
    solve: false,
    unlocks: [],
    files: [],
    auto_unlock: true,
    challenge_type: "default",
    challenge_metadata: {
        x: x,
        y: y
    }
});

export const CampaignChallenges = ({ challenges, showEditor, isEdit }) => {
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
                api.linkChallenges(
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
                    return <AddNode onClick={showEditor(emptyChallenge(x, y), chals, true)}
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
                key={chal.id} unlocked={unlocked} hidden={!isEdit && chal.hidden}
                done={!isEdit && chal.solved}

                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}

                right={right} below={below}

                isEdit={isEdit} toggleLink={toggleLink(chal)}
                points={chal.score}

                url={(isEdit || unlocked) ? "/campaign/" + challenges.id + "/challenge/" + chal.id
                    + (isEdit ? "#edit" : "") : null}

                name={(chal.hidden && !isEdit) ? <FaEyeSlash /> : !unlocked ? <FaLock /> : chal.name}
            />;
        })}</Row>
    );

    return reactRows;

};
