import React, { useState, useEffect, useContext } from "react";
import {
    XYPlot, LineSeries, HorizontalGridLines, VerticalGridLines,
    XAxis, YAxis, DiscreteColorLegend
} from 'react-vis';
import 'react-vis/dist/style.css';

import TabbedView, { Tab } from "../../components/TabbedView";
import Table from "../../components/Table";
import Page from "./bases/Page";

import "./Leaderboard.scss";
import colours from "../../Colours.scss";
import { apiContext, Spinner } from "ractf";


const Graph = ({ data }) => {
    let width;
    if (window.innerWidth <= 450)
        width = window.innerWidth - 100;
    else if (window.innerWidth <= 600)
        width = window.innerWidth - 150;
    else
        width = window.innerWidth - 200;
    width = Math.min(900, width);
        
    return <XYPlot height={300} width={width} xType={"time"} className={"graphEl"}>
        <HorizontalGridLines style={{ stroke: colours.bg_d1 }} />
        <VerticalGridLines style={{ stroke: colours.bg_d1 }} />
        <XAxis style={{ line: { stroke: colours.bg_l2 } }} />
        <YAxis style={{ line: { stroke: colours.bg_l2 } }} />

        {data.map(i =>
            <LineSeries key={i.id} data={i.data} />
        )}

        <DiscreteColorLegend style={{
            position: "absolute",
            top: "10px",
            left: "45px",
        }} color={"#f0f"} items={data.map(i => i.name)} />
    </XYPlot>;
};


export default () => {
    const api = useContext(apiContext);
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);

    useEffect(() => {
        api.ensure("leaderboard").then(data => {
            let lbdata = data.d;
            let userPlots = {};
            let teamPlots = {};
            let points = {};
            let minTime = null;

            lbdata.sort((a, b) => (new Date(a.time)) - (new Date(b.time))).map(i => {
                if (!minTime) minTime = new Date(i.time);

                if (!userPlots.hasOwnProperty(i.user_id)) {
                    userPlots[i.user_id] = { data: [{x: minTime, y: 0}], name: i.name, id: i.user_id };
                    points[i.user_id] = 0;
                }
                if (!teamPlots.hasOwnProperty(i.team_id)) {
                    teamPlots[i.team_id] = { data: [{x: minTime, y: 0}], name: i.team_name, id: i.team_id };
                    points[i.team_id] = 0;
                }
                points[i.user_id] += i.points;
                points[i.team_id] += i.points;
                userPlots[i.user_id].data.push({ x: new Date(i.time), y: points[i.user_id] });
                teamPlots[i.team_id].data.push({ x: new Date(i.time), y: points[i.team_id] });

                return 0;
            });

            setUserGraphData(
                Object.values(userPlots).sort((a, b) => points[b.id] - points[a.id])
            );
            setTeamGraphData(
                Object.values(teamPlots).sort((a, b) => points[b.id] - points[a.id])
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const userData = (lbdata) => {
        let users = {};

        lbdata.map(i => {
            if (!users.hasOwnProperty(i.user_id))
                users[i.user_id] = { id: i.user_id, name: i.name, team: i.team_name, points: 0 };
            users[i.user_id].points += i.points;
            return 0;
        });
        return Object.values(users).sort((a, b) => b.points - a.points).map(
            (i, n) => [n + 1, i.name, i.team, i.points, "/profile/" + i.id]
        );
    };

    const teamData = (lbdata) => {
        let users = {};

        lbdata.map(i => {
            if (!users.hasOwnProperty(i.team_id))
                users[i.team_id] = { id: i.team_id, name: i.team_name, points: 0 };
            users[i.team_id].points += i.points;
            return 0;
        });
        return Object.values(users).sort((a, b) => b.points - a.points).map(
            (i, n) => [n + 1, i.name, i.points, "/team/" + i.id]
        );
    };

    return <Page title={"Leaderboard"}>
        <TabbedView center initial={1}>
            <Tab label='Users'>
                <Graph data={userGraphData} />
                {api.leaderboard
                    ? <Table headings={["Ranking", "User", "Team", "Points"]} data={userData(api.leaderboard)} />
                    : <Spinner />}
            </Tab>

            <Tab label='Teams'>
                <Graph data={teamGraphData} />
                {api.leaderboard
                    ? <Table headings={["Ranking", "Team", "Points"]} data={teamData(api.leaderboard)} />
                    : <Spinner />}
            </Tab>
        </TabbedView>
    </Page>;

}