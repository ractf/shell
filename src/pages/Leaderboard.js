// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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
    Button, Graph, Tab, Table, Page, PageHead, Container
} from "@ractf/ui-kit";
import { useApi, usePaginated } from "@ractf/util/http";
import { ENDPOINTS } from "@ractf/api";
import { useInterval } from "@ractf/util";
import { useConfig, usePreference } from "@ractf/shell-util";

import URLTabbedView from "components/URLTabbedView";
import Link from "components/Link";


const Leaderboard = React.memo(() => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);
    const { t } = useTranslation();

    const [graph, , , refreshGraph] = useApi(ENDPOINTS.LEADERBOARD_GRAPH);
    const [uState, uNext, uRefresh] = usePaginated(ENDPOINTS.LEADERBOARD_USER);
    const [tState, tNext, tRefresh] = usePaginated(ENDPOINTS.LEADERBOARD_TEAM);
    const start_time = useConfig("start_time");
    const hasTeams = useConfig("enable_teams");
    const [liveReload] = usePreference("experiment.leaderboardReload");

    useEffect(() => {
        if (!graph) return;
        const lbdata = { user: [...graph.user], team: hasTeams ? [...graph.team] : [] };
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
                    data: [{ x: minTime, y: 0 }], label: i.user_name
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
    }, [graph, start_time, hasTeams]);

    useInterval(() => {
        if (!liveReload) return;
        refreshGraph();
        uRefresh();
        tRefresh();
    }, 10000);

    const userData = (lbdata) => {
        return lbdata.map((i, n) => [
            <Link to={`/profile/${i.id}`}>{n + 1}</Link>,
            <Link to={`/profile/${i.id}`}>{i.username}</Link>,
            <Link to={`/profile/${i.id}`}>{i.leaderboard_points}</Link>
        ]);
    };
    const teamData = (lbdata) => {
        return lbdata.map((i, n) => [
            <Link to={`/team/${i.id}`}>{n + 1}</Link>,
            <Link to={`/team/${i.id}`}>{i.name}</Link>,
            <Link to={`/team/${i.id}`}>{i.leaderboard_points}</Link>
        ]);
    };

    const teamTab = <>
        {teamGraphData && teamGraphData.length > 0 && (
            <Graph key="teams" data={teamGraphData} timeGraph noAnimate />
        )}
        <Table headings={["Place", t("team"), t("point_plural")]} data={teamData(tState.data)} noSort />
        {tState.hasMore && <Container full centre>
            <Button disabled={tState.loading} onClick={tNext}>{t("load_more")}</Button>
        </Container>}
    </>;
    const userTab = <>
        {userGraphData && userGraphData.length > 0 && (
            <Graph key="users" data={userGraphData} timeGraph noAnimate />
        )}
        <Table headings={["Place", t("user"), t("point_plural")]} data={userData(uState.data)} />
        {uState.hasMore && <Container full centre>
            <Button disabled={uState.loading} onClick={uNext}>{t("load_more")}</Button>
        </Container>}
    </>;

    if (hasTeams) return (
        <URLTabbedView center initial={1}>
            <Tab label={t("team_plural")} index={"team"}>
                {teamTab}
            </Tab>

            <Tab label={t("user_plural")} index={"user"}>
                {userTab}
            </Tab>
        </URLTabbedView>
    );
    return userTab;
});
Leaderboard.displayName = "Leaderboard";

const LeaderboardPage = () => {
    const { t } = useTranslation();

    return <Page title={t("leaderboard")}>
        <PageHead>{t("leaderboard")}</PageHead>
        <Leaderboard />
    </Page>;
};
export default React.memo(LeaderboardPage);
