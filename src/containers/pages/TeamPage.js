import React, { useContext } from "react";

import OverviewPage from "./bases/OverviewPage";

import { apiContext } from "ractf";


export default () => {
    const api = useContext(apiContext);
    const suffix = n => {
        let l = n.toString()[n.toString().length - 1];
        return l === "1" ? "st" : l === "2" ? "nd" : "rd";
    }

    const members = api.team.members.map(
        m => [m.name, 0]
    );
    // ["Challenge", points, "Team member", "Timestamp"]
    const solves = [];
    const place = 1;

    return (
        <OverviewPage
            title={api.team.name}
            website={api.team.website}
            underTitle={place + suffix(place) + " Place"}
            description={api.team.description}

            sections={[
                ["Members",
                ["Name", "Points"],
                members
            ],
                ["Solves",
                ["Challenge", "Points", "Solver", "Time"],
                solves
            ]]}
        />
    )
}
