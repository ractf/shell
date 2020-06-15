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

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
    Button, Row, Graph, TabbedView, Tab, Table, Page
} from "@ractf/ui-kit";
import { useApi, usePaginated, api } from "ractf";
import { useConfig } from "@ractf/util";


export default () => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);
    const { t } = useTranslation();

    const [graph] = useApi(api.ENDPOINTS.LEADERBOARD_GRAPH);
    const [uState, uNext] = usePaginated(api.ENDPOINTS.LEADERBOARD_USER);
    const [tState, tNext] = usePaginated(api.ENDPOINTS.LEADERBOARD_TEAM);
    const start_time = useConfig("start_time");

    useEffect(() => {
        if (!graph) return;
        const lbdata = { user: [...graph.user], team: [...graph.team] };
        const userPlots = {};
        const teamPlots = {};
        const points = {};
        let minTime = null;

        lbdata.user.sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
        lbdata.team.sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));

        if (lbdata.user.length)
            minTime = lbdata.user[0].timestamp;
        if (lbdata.team.length && (!minTime || lbdata.team[0].timestamp < minTime))
            minTime = lbdata.team[0].timestamp;
        if (new Date(start_time * 1000) < new Date(minTime))
            minTime = new Date(start_time * 1000);

        lbdata.user.forEach(i => {
            const id = "user_" + i.user_name;

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
            const id = "team_" + i.team_name;

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
    }, [graph, start_time]);

    const userData = (lbdata) => {
        return lbdata.map((i, n) => [n + 1, i.username, i.leaderboard_points, "/profile/" + i.id]);
    };
    const teamData = (lbdata) => {
        return lbdata.map((i, n) => [n + 1, i.name, i.leaderboard_points, "/team/" + i.id]);
    };

    return <Page title={t("leaderboard")}>
        <TabbedView center initial={1}>
            <Tab label={t("user_plural")}>
                <Graph data={userGraphData} />
                <Table headings={["Place", t("user"), t("point_plural")]} data={userData(uState.data)} />
                {uState.hasMore && <Row>
                    <Button disabled={uState.loading} click={uNext}>Load More</Button>
                </Row>}
            </Tab>

            <Tab label={t("team_plural")}>
                <Graph data={teamGraphData} />
                <Table headings={["Place", t("team"), t("point_plural")]} data={teamData(tState.data)} />
                {tState.hasMore && <Row>
                    <Button disabled={tState.loading} click={tNext}>Load More</Button>
                </Row>}
            </Tab>
        </TabbedView>
    </Page>;
};
