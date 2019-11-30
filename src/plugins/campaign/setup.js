import React, { useState } from "react";

import { registerPlugin } from "ractf";

import AddNode from "./components/AddNode";
import Node from "./components/Node";
import Row from "./components/Row";
import "./components/Spacer.scss";


const NORTH = 1, WEST = 2, SOUTH = 4, EAST = 8;


const getChal = (tab, x, y) => {
    for (let i = 0; i < tab.chal.length; i++) {
        if (tab.chal[i].x === x && tab.chal[i].y === y)
            return tab.chal[i];
    }
    return {};
};


const emptyChallenge = (x, y) => ({
    lock: false,
    solve: false,
    metadata: {
        x: x,
        y: y
    }
});


const CampaignChallenges = ({ challenges, showChallenge, showEditor, isEdit }) => {
    const [reRender, setReRender] = useState(0);

    const toggleLink = chal => {
        return side => {
            switch (side) {
                case "up":
                    chal.link ^= NORTH;
                    break;
                case "down":
                    chal.link ^= SOUTH;
                    break;
                case "left":
                    chal.link ^= WEST;
                    break;
                case "right":
                    chal.link ^= EAST;
                    break;
                default:
                    break;
            }

            setReRender(reRender + 1);
        };
    };

    let rows = [];
    let max_x = 0;
    challenges.chals.forEach((chal, n) => {
        max_x = Math.max(chal.metadata.x, max_x);
        while (rows.length <= chal.metadata.y)
            rows.push([]);
        while (rows[chal.metadata.y].length <= chal.metadata.x)
            if (isEdit) rows[chal.metadata.y].push(<AddNode click={showEditor(emptyChallenge(rows[chal.metadata.y].length, chal.metadata.y), challenges.chal, true)} key={rows[chal.metadata.y].length} />);
            else rows[chal.metadata.y].push(<div className={"campaignSpacer"} key={rows[chal.metadata.y].length} />);

        rows[chal.metadata.y][chal.metadata.x] = <Node key={chal.metadata.x} unlocked={isEdit || !chal.lock} done={isEdit ? false : chal.solve}
            lockDoneR={isEdit ? false : chal.solve && !(chal.link & EAST && !getChal(challenges, chal.metadata.x + 1, chal.metadata.y).solve)}
            lockDoneD={isEdit ? false : chal.solve && !(chal.link & SOUTH && !getChal(challenges, chal.metadata.x, chal.metadata.y + 1).solve)}

            lockUnlockedR={isEdit ? true : chal.solve || (chal.link & EAST && getChal(challenges, chal.metadata.x + 1, chal.metadata.y).solve)}
            lockUnlockedD={isEdit ? true : chal.solve || (chal.link & SOUTH && getChal(challenges, chal.metadata.x, chal.metadata.y + 1).solve)}

            click={isEdit ? showEditor(chal) : showChallenge(chal)}
            isEdit={isEdit} toggleLink={toggleLink(chal)}

            up={!!(chal.link & NORTH)} down={!!(chal.link & SOUTH)}
            right={!!(chal.link & EAST)} left={!!(chal.link & WEST)}
            name={chal.lock ? "???" : chal.name} />;
    });
    if (isEdit && max_x < 2) max_x++;

    rows.forEach((row, n) => {
        while (row.length <= max_x)
            if (isEdit)
                row.push(<AddNode click={showEditor(emptyChallenge(row.length, n), challenges.chal, true)} key={row.length} />);
            else row.push(<div className={"campaignSpacer"} key={row.length} />);

        rows[n] = <Row key={n}>
            {row}
        </Row>;
    });
    if (isEdit) {
        let row = [];
        while (row.length <= max_x)
            if (isEdit)
                row.push(<AddNode click={showEditor(emptyChallenge(row.length, rows.length), challenges.chal, true)} key={row.length} />);
            else row.push(<div className={"campaignSpacer"} key={row.length} />);

        rows[rows.length] = <Row key={rows.length + 1}>
            {row}
        </Row>;
    }

    return rows;
}


export default () => {
    registerPlugin("categoryType", "campaign", { component: CampaignChallenges });
}
