import React, { useState, useEffect, useCallback, useContext } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';

import TabbedView, { Tab } from "../../components/TabbedView";
import Table from "../../components/Table";
import Page from "./bases/Page";

import { Spinner, useApi, usePaginated, Button, apiContext, ENDPOINTS } from "ractf";

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
            margin: {l: 50, r: 50, t: 50, pad: 0},
            hovermode: "closest",
            legend: {orientation: "h", font: {color: colours.bg_l4}},
            plot_bgcolor: colours.bg_d0,
            plot_fgcolor: colours.fg,
            paper_bgcolor: colours.bg_d0,
            xaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: {color: colours.bg_l4},
                showspikes: true
            },
            yaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: {color: colours.bg_l4},
                showspikes: true
            },
        }}
    />;
};


export default () => {
    const [userGraphData, setUserGraphData] = useState([]);
    const [teamGraphData, setTeamGraphData] = useState([]);

    const [graph] = useApi(ENDPOINTS.LEADERBOARD_GRAPH);
    const [uResults, uNext, uLoading] = usePaginated(ENDPOINTS.LEADERBOARD_USER);
    const [tResults, tNext, tLoading] = usePaginated(ENDPOINTS.LEADERBOARD_TEAM);

    const api = useContext(apiContext);

    useEffect(() => {
        if (!graph) return;
        let lbdata = {user: [...graph.user], team: [...graph.team]};
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
        if (new Date(api.config.start_time * 1000) < new Date(minTime))
            minTime = new Date(api.config.start_time * 1000);

        lbdata.user.forEach(i => {
            let id = "user_" + i.user_name;

            if (!userPlots.hasOwnProperty(id)) {
                userPlots["user_" + i.user_name] = {
                    x: [minTime], y: [0], type: "scatter",
                    mode: "lines+markers", name: i.user_name, id: id
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
                    x: [minTime], y: [0], type: "scatter",
                    mode: "lines+markers", name: i.team_name, id: id
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
    }, [graph]);

    const userData = (lbdata) => {
        return lbdata.map((i, n) => [i.username, i.leaderboard_points]);
    };
    const teamData = (lbdata) => {
        return lbdata.map((i, n) => [i.name, i.leaderboard_points]);
    };

    return <Page title={"Leaderboard"}>
        <TabbedView center initial={1}>
            <Tab label='Users'>
                <Graph data={userGraphData} />
                <Table headings={["User", "Points"]} data={userData(uResults.results)} />
                {uResults.hasMore && <Button disabled={uLoading} click={uNext}>Load More</Button>}
            </Tab>

            <Tab label='Teams'>
                <Graph data={teamGraphData} />
                <Table headings={["Team", "Points"]} data={teamData(tResults.results)} />
                {tResults.hasMore && <Button disabled={tLoading} click={tNext}>Load More</Button>}
            </Tab>
        </TabbedView>
    </Page>;

};