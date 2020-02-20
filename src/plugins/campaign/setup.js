import React, { useState, useContext } from "react";

import { apiContext, apiEndpoints, registerPlugin } from "ractf";

import AddNode from "./components/AddNode";
import Node from "./components/Node";
import Row from "./components/Row";
import "./components/Spacer.scss";


const NORTH = 1, WEST = 2, SOUTH = 4, EAST = 8;

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
    const api = useContext(apiContext);

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
        maxX++;
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
                    return <AddNode click={showEditor(emptyChallenge(x, y), chals, true)} key={x} />;
                 return <div className={"campaignSpacer"} key={x} />;
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


            let unlocked = isEdit || !chal.lock;
            // Admins are a special edge-case for unlocked challenges
            if (!isEdit && unlocked && api.user.is_staff && !chal.solved) {
                if (!((linksU && above.solved) || (linksD && below.solved)
                    || (linksR && right.solved) || (linksL && left.solved)))
                    unlocked = false;
            }

            return <Node
                x={x} y={y} key={chal.id} id={chal.id} unlocks={chal.unlocks}
                unlocked={unlocked} done={isEdit ? false : chal.solved}

                linksR={linksR} linksL={linksL} linksU={linksU} linksD={linksD}

                right={right} left={left} above={above} below={below}

                click={isEdit ? showEditor(chal) : ""}
                isEdit={isEdit} toggleLink={toggleLink(chal)}

                url={unlocked ? "/campaign/" + challenges.id + "/challenge/" + chal.id : null}

                name={!unlocked ? "???" : chal.name}
            />;
        })}</Row>
    );

    /*
    let rows = [];
    let max_x = 0;
    challenges.chals.forEach((chal, n) => {
        max_x = Math.max(chal[meta].x, max_x);
        while (rows.length <= chal[meta].y)
            rows.push([]);
        while (rows[chal[meta].y].length <= chal[meta].x)
            if (isEdit) rows[chal[meta].y].push(
                <AddNode click={
                    showEditor(emptyChallenge(rows[chal[meta].y].length, chal[meta].y), challenges.chal, true)
                } key={rows[chal[meta].y].length} />
            );
            else rows[chal[meta].y].push(<div className={"campaignSpacer"} key={rows[chal[meta].y].length} />);

        let unlocked = isEdit || !chal.lock;
        // Admins are a special edge-case for unlocked challenges
        if (!isEdit && unlocked && api.user.is_staff && !chal.solved) {
            if (!((chal.link & EAST && getChal(challenges, chal[meta].x + 1, chal[meta].y).solved)
                || (chal.link & WEST && getChal(challenges, chal[meta].x - 1, chal[meta].y).solved)
                || (chal.link & NORTH && getChal(challenges, chal[meta].x, chal[meta].y + 1).solved)
                || (chal.link & SOUTH && getChal(challenges, chal[meta].x, chal[meta].y - 1).solved))) {
                unlocked = false;
            }
        }

        rows[chal[meta].y][chal[meta].x] = <Node
            x={chal[meta].x} y={chal[meta].y} key={chal.id}
            unlocked={unlocked} done={isEdit ? false : chal.solved}

            chalmap={chalmap}

            lockDoneR={isEdit ? false : chal.solved &&
                !(chal.link & EAST && !getChal(challenges, chal[meta].x + 1, chal[meta].y).solved)}
            lockDoneD={isEdit ? false : chal.solved &&
                !(chal.link & SOUTH && !getChal(challenges, chal[meta].x, chal[meta].y + 1).solved)}

            lockUnlockedR={isEdit ? true : chal.solved ||
                (chal.link & EAST && getChal(challenges, chal[meta].x + 1, chal[meta].y).solved)}
            lockUnlockedD={isEdit ? true : chal.solved ||
                (chal.link & SOUTH && getChal(challenges, chal[meta].x, chal[meta].y + 1).solved)}

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
                row.push(
                    <AddNode click={showEditor(emptyChallenge(row.length, n), challenges.chal, true)}
                        key={row.length} />
                );
            else row.push(<div className={"campaignSpacer"} key={row.length} />);

        rows[n] = <Row key={n}>
            {row}
        </Row>;
    });
    if (isEdit) {
        let row = [];
        while (row.length <= max_x)
            if (isEdit)
                row.push(
                    <AddNode click={showEditor(emptyChallenge(row.length, rows.length), challenges.chal, true)}
                        key={row.length} />
                );
            else row.push(<div className={"campaignSpacer"} key={row.length} />);

        rows[rows.length] = <Row key={rows.length + 1}>
            {row}
        </Row>;
    }
    */

    return reactRows;

    return rows;
};


export default () => {
    registerPlugin("categoryType", "campaign", { component: CampaignChallenges });
};
