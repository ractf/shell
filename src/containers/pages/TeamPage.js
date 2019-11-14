import React, { useContext, useEffect, useState } from "react";

import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import OverviewPage from "./bases/OverviewPage";
import Page from "./bases/Page";

import { apiContext, Spinner, FormError } from "ractf";


export default () => {
    const api = useContext(apiContext);
    const suffix = n => {
        let l = n.toString()[n.toString().length - 1];
        return l === "1" ? "st" : l === "2" ? "nd" : "rd";
    }

    // ["Challenge", points, "Team member", "Timestamp"]
    const solves = [];
    const place = 1;

    const [teamData, setTeamData] = useState(null);
    const [error, setError] = useState(null);
    const { match } = useReactRouter();
    const team = match.params.team;

    useEffect(() => {
        api.getTeam(team).then(data => {
            setTeamData(data.d);
        }).catch(e => {
            let error = api.getError(e)
            setError(error) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team]);

    if (error) return <Page title={"Teans"} vCentre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!teamData) return <Page title={"Teams"} vCentre><Spinner /></Page>;

    const members = teamData.members.map(
        m => [m.name, 0, "/profile/" + m.id]
    );
    console.log(teamData);

    return (
        <OverviewPage
            title={teamData.name}
            website={teamData.website}
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
