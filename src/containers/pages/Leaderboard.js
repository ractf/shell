import React, { useEffect } from "react";
import styled from "styled-components";

import TabbedView from "../../components/TabbedView";
import Table from "../../components/Table";
import Page from "./bases/Page";

import { darken } from "polished";
import theme from "theme";


const GraphEl = styled.div`
    width: 100%;
    margin: auto;
    margin-top: 1em;
    height: 300px;
    box-shadow: 0 0 1px ${darken(.05, theme.bg)};
    background-color: ${darken(.035, theme.bg)};
    position: relative;
    overflow: hidden;
    margin-bottom: 32px;

    &::before{
        content: "Loading chart...";
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.2em;
    }
`;

export default () => {
    const userData = [
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
    ]

    const teamData = [
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
    ]

    const userGraphData = [];
    const teamGraphData = [];
    const userGraphEl = React.createRef();
    const teamGraphEl = React.createRef();

    useEffect(() => {

    });

    let initDone = [false, false];
    const tabSwitch = i => {
        if (initDone[i]) return;
        if (!window.Plotly) return setTimeout(() => {tabSwitch(i)}, 500);
        initDone[i] = true;

        if (i === 0) {
            window.Plotly.react(userGraphEl.current, userGraphData, {
                plot_bgcolor: theme.bg,
                paper_bgcolor: theme.bg,
                font: {
                    family: theme.font_stack,
                    color: theme.fg
                }
            }, {
                responsive: true
            });
        } else {
            window.Plotly.react(teamGraphEl.current, teamGraphData, {
                plot_bgcolor: theme.bg,
                paper_bgcolor: theme.bg,
                font: {
                    family: theme.font_stack,
                    color: theme.fg
                }
            }, {
                responsive: true
            });
        }
    };

    return <Page title={"Leaderboard"}>
        <TabbedView center callback={tabSwitch} initial={1}>
            <div label='Users'>
                <GraphEl ref={userGraphEl} />
                <Table headings={["Ranking", "User", "Website", "Team", "Affiliation", "Points"]} data={userData} />
            </div>

            <div label='Teams'>
                <GraphEl ref={teamGraphEl} />
                <Table headings={["Ranking", "Team", "Country", "Website", "Affiliation", "Points"]} data={teamData} />
            </div>
        </TabbedView>
    </Page>;

}