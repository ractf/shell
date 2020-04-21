import React, { useState, useContext } from "react";

import { apiEndpoints, registerPlugin } from "ractf";

import AddNode from "./components/AddNode";
import Node from "./components/Node";
import Row from "./components/Row";
import "./components/Spacer.scss";


const meta = "challenge_metadata";

const emptyChallenge = (x, y) => ({
    lock: false,
    solve: false,
    unlocks: [],
    files: [],
    challenge_metadata: {
        x: x,
        y: y
    }
});


const CampaignChallenges = ({ challenges, showEditor, isEdit }) => {
    const [reRender, setReRender] = useState(0);
    const endpoints = useContext(apiEndpoints);

    let chals = challenges.challenges || [];

    // Inflate the list of challenges into a 2d structure
    let rows = [], maxX = 0;
    chals.forEach(chal => {
        let { x, y } = chal[meta];
        while (rows.length <= y) rows.push([]);
        while (rows[y].length <= x) rows[y].push(null);

        rows[y][x] = chal;
        if (x > maxX) maxX = x;
    });

    const toggleLink = chal => {
        let { x, y } = chal[meta];
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
                endpoints.linkChallenges(
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
    let reactRows = rows.map((row, y) =>
        <Row key={y}>{row.map((chal, x) => {
            if (!chal) {
                if (isEdit)
                    return <AddNode click={showEditor(emptyChallenge(x, y), chals, true)} key={"add_" + x + "," + y} />;
                 return <div className={"campaignSpacer"} key={"spacer_" + x + "," + y} />;
            }

            // ( ... || []) ensures we have a list to lookup with [x].
            let right = rows[y][x + 1],
                left = rows[y][x - 1],
                above = (rows[y - 1] || [])[x],
                below = (rows[y + 1] || [])[x];
            
            let linksR = (right && chal.unlocks.indexOf(right.id) !== -1),
                linksL = (left && chal.unlocks.indexOf(left.id) !== -1),
                linksU = (above && chal.unlocks.indexOf(above.id) !== -1),
                linksD = (below && chal.unlocks.indexOf(below.id) !== -1);


            let unlocked = isEdit || (chal.unlocked && !chal.hidden);
            // Admins are a special edge-case for unlocked challenges
            /*if (!isEdit && unlocked && api.user.is_staff && !chal.solved) {
                if (!((linksU && above.solved) || (linksD && below.solved)
                    || (linksR && right.solved) || (linksL && left.solved)))
                    unlocked = false;
            }*/

            return <Node
                key={chal.id} unlocked={unlocked}
                done={isEdit ? false : chal.solved}

                linksR={linksR} linksL={linksL}
                linksU={linksU} linksD={linksD}

                right={right} below={below}

                click={isEdit ? showEditor(chal) : ""}
                isEdit={isEdit} toggleLink={toggleLink(chal)}
                points={chal.score}

                url={unlocked ? "/campaign/" + challenges.id + "/challenge/" + chal.id : null}

                name={!unlocked ? "???" : chal.name}
            />;
        })}</Row>
    );

    return reactRows;

};


export default () => {
    registerPlugin("categoryType", "campaign", { component: CampaignChallenges });
    registerPlugin("challengeMetadata", "campaign", {
        fields: [
            {label: "Campaign settings:", type: "label"},
            {name: "x", label: "X Position", type: "number"},
            {name: "y", label: "Y Position", type: "number"},
            {type: "hr"},
        ],
        check: (challenge, category) => {
            return category.contained_type === "campaign";
        }
    });
};
