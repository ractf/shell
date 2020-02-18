import React, { useState, useEffect, useCallback } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';
import { useTranslation } from 'react-i18next';

import TabbedView, { Tab } from "../../components/TabbedView";
import Table from "../../components/Table";
import Page from "./bases/Page";

import { Spinner, useApi } from "ractf";

import "./Leaderboard.scss";
import colours from "../../Colours.scss";


const usePlotlyReady = () => {
    const [plready, setPlready] = useState(window.__PLReady);
    const check = useCallback(() => {
        if (!plready && window.Plotly) {
            if (!window.__PLReady) {
                window.Plot = createPlotlyComponent(window.Plotly);
                window.__PLReady = true;
            }
            setPlready(true);
        } else setTimeout(check, 200);
    }, [plready]);
    if (!plready) setTimeout(check, 200);
    return plready;
};


const Graph = ({ data }) => {
    const plReady = usePlotlyReady();
    const [rr, setRr] = useState(0);

    const onResize = (e) => {
        setRr(rr + 1);
    };
    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });
    if (!plReady) return <div className={"graph-loading"}>
        <Spinner />
    </div>;

    let width;
    if (window.innerWidth <= 800)
        width = window.innerWidth - 90;
    else if (window.innerWidth <= 1200)
        width = window.innerWidth - 400;
    else
        width = window.innerWidth - 527;
    width = Math.min(1001, width);

    const Plot = window.Plot;
    return <Plot
        data={data}
        layout={{
            width: width, height: 300,
            margin: { l: 50, r: 50, t: 50, pad: 0 },
            hovermode: "closest",
            legend: { orientation: "h", font: { color: colours.bg_l4 } },
            plot_bgcolor: colours.bg_d0,
            plot_fgcolor: colours.fg,
            paper_bgcolor: colours.bg_d0,
            xaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: { color: colours.bg_l4 },
                showspikes: true
            },
            yaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: { color: colours.bg_l4 },
                showspikes: true
            },
        }}
    />;
};


export default () => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);
    const { t } = useTranslation();

    const [leaderboard] = useApi("/leaderboard/");

    useEffect(() => {
        if (!leaderboard) return;
        let lbdata = [...leaderboard];
        let userPlots = {};
        let teamPlots = {};
        let points = {};
        let minTime = null;

        lbdata.sort((a, b) => (new Date(a.time)) - (new Date(b.time))).map(i => {
            if (!minTime) minTime = new Date(i.time);

            if (!userPlots.hasOwnProperty(i.user_id)) {
                userPlots[i.user_id] = {
                    x: [minTime], y: [0], type: "scatter",
                    mode: "lines+markers", name: i.name, id: i.user_id
                };
                points[i.user_id] = 0;
            }
            if (!teamPlots.hasOwnProperty(i.team_id)) {
                teamPlots[i.team_id] = {
                    x: [minTime], y: [0], type: "scatter",
                    mode: "lines+markers", name: i.team_name, id: i.team_id
                };
                points[i.team_id] = 0;
            }
            points[i.user_id] += i.points;
            points[i.team_id] += i.points;
            userPlots[i.user_id].x.push(new Date(i.time));
            userPlots[i.user_id].y.push(points[i.user_id]);
            teamPlots[i.team_id].x.push(new Date(i.time));
            teamPlots[i.team_id].y.push(points[i.team_id]);

            return 0;
        });
        /*
        let now = new Date();
        for (let i in userPlots) {
            userPlots[i].x.push(now);
            userPlots[i].y.push(points[i]);
        }
        for (let i in teamPlots) {
            teamPlots[i].x.push(now);
            teamPlots[i].y.push(points[i]);
        }
        */

        setUserGraphData(
            Object.values(userPlots).sort((a, b) => points[b.id] - points[a.id])
        );
        setTeamGraphData(
            Object.values(teamPlots).sort((a, b) => points[b.id] - points[a.id])
        );
    }, [leaderboard]);

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

    return <Page title={t("leaderboard")}>
        <TabbedView center initial={1}>
            <Tab label={t("user_plural")}>
                <Graph data={userGraphData} />
                {leaderboard
                    ? <Table headings={[t("rank"), t("user"), t("team"), t("point_plural")]}
                        data={userData(leaderboard)} />
                    : <Spinner />}
            </Tab>

            <Tab label={t("team_plural")}>
                <Graph data={teamGraphData} />
                {leaderboard
                    ? <Table headings={[t("rank"), t("team"), t("point_plural")]}
                        data={teamData(leaderboard)} />
                    : <Spinner />}
            </Tab>
        </TabbedView>
    </Page>;

};