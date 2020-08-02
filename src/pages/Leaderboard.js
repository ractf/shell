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
    Button, Row, Graph, URLTabbedView, Tab, Table, Page, PageHead
} from "@ractf/ui-kit";
import { useApi, usePaginated } from "ractf";
import { ENDPOINTS } from "@ractf/api";
import { useConfig } from "@ractf/util";


const LeaderboardPage = () => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);
    const { t } = useTranslation();

    const [graph] = useApi(ENDPOINTS.LEADERBOARD_GRAPH);
    const [uState, uNext] = usePaginated(ENDPOINTS.LEADERBOARD_USER);
    const [tState, tNext] = usePaginated(ENDPOINTS.LEADERBOARD_TEAM);
    const start_time = useConfig("start_time");
    const hasTeams = useConfig("enable_teams");

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
                    data: [{ x: 1 + minTime, y: 0 }], label: i.user_name
                };
                points[id] = 0;
            }

            points[id] += i.points;
            userPlots[id].data.push({ x: new Date(i.timestamp), y: points[id] });
        });
        lbdata.team.forEach(i => {
            const id = "team_" + i.team_name;

            if (!teamPlots.hasOwnProperty(id)) {
                teamPlots[id] = {
                    data: [{ x: minTime, y: 0 }], label: i.team_name
                };
                points[id] = 0;
            }
            points[id] += i.points;
            teamPlots[id].data.push({ x: new Date(i.timestamp), y: points[id] });
        });

        setUserGraphData(
            Object.values(userPlots).sort((a, b) => points[b.id] - points[a.id])
        );
        setTeamGraphData(
            Object.values(teamPlots).sort((a, b) => points[b.id] - points[a.id])
        );
    }, [graph, start_time]);

    const userData = (lbdata) => {
        return lbdata.map((i, n) => [n + 1, i.username, i.leaderboard_points, { link: "/profile/" + i.id }]);
    };
    const teamData = (lbdata) => {
        return lbdata.map((i, n) => [n + 1, i.name, i.leaderboard_points, { link: "/team/" + i.id }]);
    };

    const teamTab = <>
        {teamGraphData && teamGraphData.length > 0 && (
            <Graph key="teams" data={teamGraphData} timeGraph noAnimate />
        )}
        <Table headings={["Place", t("team"), t("point_plural")]} data={teamData(tState.data)} />
        {tState.hasMore && <Row>
            <Button disabled={tState.loading} onClick={tNext}>Load More</Button>
        </Row>}
    </>;
    const userTab = <>
        {userGraphData && userGraphData.length > 0 && (
            <Graph key="users" data={userGraphData} timeGraph noAnimate />
        )}
        <Table headings={["Place", t("user"), t("point_plural")]} data={userData(uState.data)} />
        {uState.hasMore && <Row>
            <Button disabled={uState.loading} onClick={uNext}>Load More</Button>
        </Row>}
    </>;

    return <Page title={t("leaderboard")}>
        <PageHead>{t("leaderboard")}</PageHead>
        {hasTeams ? (
            <URLTabbedView center initial={1}>
                <Tab label={t("team_plural")} index={"team"}>
                    {teamTab}
                </Tab>

                <Tab label={t("user_plural")} index={"user"}>
                    {userTab}
                </Tab>
            </URLTabbedView>
        ) : userTab}
    </Page>;
};
export default React.memo(LeaderboardPage);
