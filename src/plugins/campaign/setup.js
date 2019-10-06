import React from "react";

import { registerPlugin } from "ractf";

import Spacer from "./components/Spacer";
import Node from "./components/Node";
import Row from "./components/Row";


const NORTH = 1, WEST = 2, SOUTH = 4, EAST = 8;


const getChal = (tab, x, y) => {
    for (let i = 0; i < tab.chal.length; i++) {
        if (tab.chal[i].x === x && tab.chal[i].y === y)
        return tab.chal[i];
    }
    return {};
}


const makeChallenges = (challenges, showChallenge) => {
    let rows = [];
    let max_x = 0;
    challenges.chal.forEach((chal, n) => {
        max_x = Math.max(chal.x, max_x);
        while (rows.length <= chal.y)
            rows.push([]);
        while (rows[chal.y].length <= chal.x)
            rows[chal.y].push(<Spacer key={n} />);

        rows[chal.y][chal.x] = <Node key={n} unlocked={!chal.lock} done={chal.solve}
            lockDoneR={chal.solve && !(chal.link & EAST && !getChal(challenges, chal.x + 1, chal.y).solve)}
            lockDoneD={chal.solve && !(chal.link & SOUTH && !getChal(challenges, chal.x, chal.y + 1).solve)}

            lockUnlockedR={chal.solve || (chal.link & EAST && getChal(challenges, chal.x + 1, chal.y).solve)}
            lockUnlockedD={chal.solve || (chal.link & SOUTH && getChal(challenges, chal.x, chal.y + 1).solve)}

            click={showChallenge(chal)}

            up={!!(chal.link & NORTH)} down={!!(chal.link & SOUTH)}
            right={!!(chal.link & EAST)} left={!!(chal.link & WEST)}
            name={chal.lock ? "???" : chal.name} />;
    });
    rows.forEach((row, n) => {
        while (row.length <= max_x) {
            row.push(<Spacer key={row.length} />)
        }
        rows[n] = <Row key={n}>
            { row }
        </Row>;
    });

    return rows;
}


export default () => {
    registerPlugin("categoryType", 0, {generator: makeChallenges});
}
