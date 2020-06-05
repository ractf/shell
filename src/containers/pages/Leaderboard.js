import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from 'react-i18next';

import {
    Button, Row, Graph, TabbedView, Tab, Table, Page
} from "@ractf/ui-kit";
import { useApi, usePaginated, apiEndpoints, ENDPOINTS } from "ractf";


export default () => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);
    const { t } = useTranslation();

    const [graph] = useApi(ENDPOINTS.LEADERBOARD_GRAPH);
    const [uState, uNext] = usePaginated(ENDPOINTS.LEADERBOARD_USER);
    const [tState, tNext] = usePaginated(ENDPOINTS.LEADERBOARD_TEAM);


    const api = useContext(apiEndpoints);

    useEffect(() => {
        if (!graph) return;
        let lbdata = { user: [...graph.user], team: [...graph.team] };
        let userPlots = {};
        let teamPlots = {};
        let points = {};
        let minTime = null;

        lbdata.user.sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
        lbdata.team.sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));

        if (lbdata.user.length)
            minTime = lbdata.user[0].timestamp;
        if (lbdata.team.length && (!minTime || lbdata.team[0].timestamp < minTime))
            minTime = lbdata.team[0].timestamp;
        if (new Date(api.configGet("start_time") * 1000) < new Date(minTime))
            minTime = new Date(api.configGet("start_time") * 1000);

        lbdata.user.forEach(i => {
            let id = "user_" + i.user_name;

            if (!userPlots.hasOwnProperty(id)) {
                userPlots["user_" + i.user_name] = {
                    x: [minTime], y: [0], name: i.user_name, id: id
                };
                points[id] = 0;
            }

            points[id] += i.points;
            userPlots[id].x.push(new Date(i.timestamp));
            userPlots[id].y.push(points[id]);
        });
        lbdata.team.forEach(i => {
            let id = "team_" + i.team_name;

            if (!teamPlots.hasOwnProperty(id)) {
                teamPlots[id] = {
                    x: [minTime], y: [0], name: i.team_name, id: id
                };
                points[id] = 0;
            }
            points[id] += i.points;
            teamPlots[id].x.push(new Date(i.timestamp));
            teamPlots[id].y.push(points[id]);
        });

        setUserGraphData(
            Object.values(userPlots).sort((a, b) => points[b.id] - points[a.id])
        );
        setTeamGraphData(
            Object.values(teamPlots).sort((a, b) => points[b.id] - points[a.id])
        );
    }, [graph, api]);

    const userData = (lbdata) => {
        return lbdata.map((i, n) => [i.username, i.leaderboard_points, { link: "/profile/" + i.id }]);
    };
    const teamData = (lbdata) => {
        return lbdata.map((i, n) => [i.name, i.leaderboard_points, { link: "/team/" + i.id }]);
    };

    return <Page title={t("leaderboard")}>
        <TabbedView center initial={1}>
            <Tab label={t("user_plural")}>
                <Graph data={userGraphData} />
                <Table headings={[t("user"), t("point_plural")]} data={userData(uState.data)} />
                {uState.hasMore && <Row>
                    <Button disabled={uState.loading} onClick={uNext}>Load More</Button>
                </Row>}
            </Tab>

            <Tab label={t("team_plural")}>
                <Graph data={teamGraphData} />
                <Table headings={[t("team"), t("point_plural")]} data={teamData(tState.data)} />
                {tState.hasMore && <Row>
                    <Button disabled={tState.loading} onClick={tNext}>Load More</Button>
                </Row>}
            </Tab>
        </TabbedView>
    </Page>;
};
