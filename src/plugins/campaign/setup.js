import React, { useState, useContext } from "react";

import { apiContext, registerPlugin } from "ractf";

import AddNode from "./components/AddNode";
import Node from "./components/Node";
import Row from "./components/Row";
import "./components/Spacer.scss";


const NORTH = 1, WEST = 2, SOUTH = 4, EAST = 8;


const getChal = (tab, x, y) => {
    for (let i = 0; i < tab.chals.length; i++) {
        if (tab.chals[i].metadata.x === x && tab.chals[i].metadata.y === y)
            return tab.chals[i];
    }
    return {};
};


const emptyChallenge = (x, y) => ({
    lock: false,
    solve: false,
    deps: [],
    metadata: {
        x: x,
        y: y
    }
});


const CampaignChallenges = ({ challenges, showEditor, isEdit }) => {
    const [reRender, setReRender] = useState(0);
    const api = useContext(apiContext);

    let chalmap = {};
    challenges.chals.forEach((chal) => {
        chalmap[[chal.metadata.x, chal.metadata.y]] = chal;
    });

    const toggleLink = chal => {
        return side => {
            switch (side) {
                case "up":
                    if (chalmap[[chal.metadata.x, chal.metadata.y - 1]]) {
                        chal.link ^= NORTH;
                        chalmap[[chal.metadata.x, chal.metadata.y - 1]].link ^= SOUTH;
                        api.linkChallenges(chal, chalmap[[chal.metadata.x, chal.metadata.y - 1]], !!(chal.link & NORTH));
                        api.linkChallenges(chalmap[[chal.metadata.x, chal.metadata.y - 1]], chal, !!(chal.link & NORTH));
                    }
                    break;
                case "down":
                    if (chalmap[[chal.metadata.x, chal.metadata.y + 1]]) {
                        chal.link ^= SOUTH;
                        chalmap[[chal.metadata.x, chal.metadata.y + 1]].link ^= NORTH;
                        api.linkChallenges(chal, chalmap[[chal.metadata.x, chal.metadata.y + 1]], !!(chal.link & SOUTH));
                        api.linkChallenges(chalmap[[chal.metadata.x, chal.metadata.y + 1]], chal, !!(chal.link & SOUTH));
                    }
                    break;
                case "left":
                    if (chalmap[[chal.metadata.x - 1, chal.metadata.y]]) {
                        chal.link ^= WEST;
                        chalmap[[chal.metadata.x - 1, chal.metadata.y]].link ^= EAST;
                        api.linkChallenges(chal, chalmap[[chal.metadata.x - 1, chal.metadata.y]], !!(chal.link & WEST));
                        api.linkChallenges(chalmap[[chal.metadata.x - 1, chal.metadata.y]], chal, !!(chal.link & WEST));
                    }
                    break;
                case "right":
                    if (chalmap[[chal.metadata.x + 1, chal.metadata.y]]) {
                        chal.link ^= EAST;
                        chalmap[[chal.metadata.x + 1, chal.metadata.y]].link ^= WEST;
                        api.linkChallenges(chal, chalmap[[chal.metadata.x + 1, chal.metadata.y]], !!(chal.link & EAST));
                        api.linkChallenges(chalmap[[chal.metadata.x + 1, chal.metadata.y]], chal, !!(chal.link & EAST));
                    }
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

        let unlocked = isEdit || !chal.lock;
        // Admins are a special edge-case for unlocked challenges
        if (!isEdit && unlocked && api.user.is_admin && !chal.solved) {
            if (!((chal.link & EAST && getChal(challenges, chal.metadata.x + 1, chal.metadata.y).solved)
                 || (chal.link & WEST && getChal(challenges, chal.metadata.x - 1, chal.metadata.y).solved)
                 || (chal.link & NORTH && getChal(challenges, chal.metadata.x, chal.metadata.y + 1).solved)
                 || (chal.link & SOUTH && getChal(challenges, chal.metadata.x, chal.metadata.y - 1).solved))) {
                unlocked = false;
            }
        }

        rows[chal.metadata.y][chal.metadata.x] = <Node
            x={chal.metadata.x} y={chal.metadata.y} key={chal.id}
            unlocked={unlocked} done={isEdit ? false : chal.solved}

            chalmap={chalmap}
            
            lockDoneR={isEdit ? false : chal.solved && !(chal.link & EAST && !getChal(challenges, chal.metadata.x + 1, chal.metadata.y).solved)}
            lockDoneD={isEdit ? false : chal.solved && !(chal.link & SOUTH && !getChal(challenges, chal.metadata.x, chal.metadata.y + 1).solved)}

            lockUnlockedR={isEdit ? true : chal.solved || (chal.link & EAST && getChal(challenges, chal.metadata.x + 1, chal.metadata.y).solved)}
            lockUnlockedD={isEdit ? true : chal.solved || (chal.link & SOUTH && getChal(challenges, chal.metadata.x, chal.metadata.y + 1).solved)}

            click={isEdit ? showEditor(chal) : ""}
            isEdit={isEdit} toggleLink={toggleLink(chal)}

            url={unlocked ? "/campaign/" + challenges.id + "/challenge/" + chal.id : null}

            up={!!(chal.link & NORTH)} down={!!(chal.link & SOUTH)}
            right={!!(chal.link & EAST)} left={!!(chal.link & WEST)}
            name={!unlocked ? "???" : chal.name}
        />;
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
