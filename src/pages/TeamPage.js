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

import React from "react";
import { FaUsers, FaUser, FaTwitter, FaRedditAlien, FaDiscord } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { BrokenShards } from "./ErrorPages";

import { useReactRouter, useConfig } from "@ractf/util";
import {
    FormError, TabbedView, Tab, HR, ProgressBar, Row, Graph,
    Pie, Page, Column
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { useApi } from "ractf";
import colours from "@ractf/ui-kit/Colours.scss";
import Link from "components/Link";

import "./Profile.scss";
import { useCategories } from "@ractf/util/hooks";
import LoadingPage from "./LoadingPage";


const TeamPage = () => {
    /*
    const suffix = n => {
        let l = n.toString()[n.toString().length - 1];
        return l === "1" ? "st" : l === "2" ? "nd" : "rd";
    }
    const place = 1;
    */

    const { match } = useReactRouter();
    const categories = useCategories();
    const team = match.params.team;
    const [teamData, error] = useApi(ENDPOINTS.TEAM + (team === "me" ? "self" : team));
    const user = useSelector(state => state.user);
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");

    if (!hasTeams) return <Redirect to={"/"} />;
    if (user.team === null && team === "me") return <Redirect to={"/welcome"} />;

    if (error) return <Page title={t("teams.teams")} centre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!teamData) return <LoadingPage title={t("teams.teams")} />;

    const UserSolve = ({ solved_by_name, challenge_name, points }) => <div className={"userSolve"}>
        <div>{challenge_name}</div>
        <div>{t("teams.solve", { count: parseInt(points, 10), user_name: solved_by_name })}</div>
    </div>;

    const categoryValues = {};
    const userValues = {};
    const tData = teamData.solves.filter(Boolean).sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
    const scorePlotData = { data: [], label: "Score" };
    // OPTIONAL: Use start time instead of first solve
    // scorePlotData.data.push({ x: api.config.start_time, y: 0 });
    tData.forEach(solve => {
        let category;
        categories && categories.forEach(cat => {
            cat.challenges.forEach(chal => {
                if (chal.id === solve.challenge)
                    category = cat.name;
            });
        });
        if (category === null) return;
        if (!categoryValues[category]) categoryValues[category] = 0;
        categoryValues[category]++;
        if (!userValues[solve.solved_by_name]) userValues[solve.solved_by_name] = 0;
        userValues[solve.solved_by_name]++;

        const score = (scorePlotData.data[scorePlotData.data.length - 1] || { y: 0 }).y + solve.points;
        scorePlotData.data.push({ x: new Date(solve.timestamp), y: score });
    });

    const catProgress = [];
    categories && categories.forEach(cat => {
        let tot = 0, got = 0;
        cat.challenges.forEach(chal => {
            tot += chal.score;
        });
        tData.forEach(solve => {
            cat.challenges.forEach(chal => {
                if (chal.id === solve.challenge) {
                    got += solve.points;
                }
            });
        });
        catProgress.push([cat.name, got, tot]);
    });

    return <Page title={teamData.name}>
        <Column xlWidth={3} lgWidth={4} mdWidth={12}>
            <div className={"userMeta"}>
                <div className={"userName"}><FaUsers /> {teamData.name}</div>
                <div>{t("point_count", { count: teamData.leaderboard_points })}</div>
                <div className={"userBio" + ((!teamData.description || teamData.description.length === 0)
                    ? " noBio" : "")}>
                    {teamData.description || t("teams.no_bio")}
                </div>

                {teamData.social && <>
                    {teamData.twitter && teamData.twitter.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"} rel={"noopener noreferrer"}
                            href={"https://twitter.com/" + encodeURIComponent(teamData.twitter)}>
                            <FaTwitter /><span>@{teamData.twitter}</span>
                        </a>}
                    {teamData.reddit && teamData.reddit.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"} rel={"noopener noreferrer"}
                            href={"https://reddit.com/u/" + encodeURIComponent(teamData.reddit)}>
                            <FaRedditAlien /><span>/u/{teamData.reddit}</span>
                        </a>}
                    {teamData.discord && teamData.discord.length !== 0 &&
                        (teamData.discordid && teamData.discordid.length !== 0
                            ? <a target={"_blank"} rel={"noopener noreferrer"}
                                href={"https://discordapp.com/users/" + encodeURIComponent(teamData.discordid)}
                                className={"userSocial"}>
                                <FaDiscord /><span>{teamData.discord}</span>
                            </a>
                            : <span className={"userSocial"}>
                                <FaDiscord /><span>{teamData.discord}</span>
                            </span>)}
                </>}

                {teamData.members.map((i, n) => <><Link to={"/profile/" + i.id} className={"teamMemberico"} key={n}>
                    <FaUser /> {i.username}
                </Link><br /></>)}
            </div>
        </Column>
        <Column xlWidth={9} lgWidth={8} mdWidth={12}>
            <div className={"userSolves"}>
                {(!teamData.solves || teamData.solves.filter(Boolean).length === 0) ? <div className={"noSolves"}>
                    {t("teams.no_solves", { name: teamData.name })}
                </div> : <TabbedView>
                        <Tab label={"Solves"}>
                            {teamData.solves && teamData.solves.filter(Boolean).map(i => (
                                <UserSolve key={i.timestamp} {...i} />
                            ))}
                        </Tab>
                        <Tab label={"Stats"}>
                            <div className={"ppwRow"}>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Solve attempts</div>
                                    <Pie data={[teamData.solves.filter(Boolean).length, teamData.incorrect_solves]}
                                        labels={["Correct", "Incorrect"]}
                                        colors={[colours.green, colours.red]} />
                                </div>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Category Breakdown</div>
                                    <Pie data={Object.values(categoryValues)}
                                        labels={Object.keys(categoryValues)} />
                                </div>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>User Breakdown</div>
                                    <Pie data={Object.values(userValues)}
                                        labels={Object.keys(userValues)} />
                                </div>
                            </div>
                            <HR />
                            <div>
                                <div className={"ppwHead"}>Category Progress</div>
                                {catProgress.map(([name, got, tot]) => <>
                                    <span style={{ fontWeight: 700 }}>{name}</span>
                                    <span style={{ fontSize: ".8em", marginLeft: 8 }}>
                                        {got}/{tot} ({tot === 0 ? 100 : Math.round(got / tot * 10000) / 100}%)
                                    </span>
                                    <Row>
                                        <ProgressBar thick progress={tot === 0 ? 100 : got / tot} width={"auto"} />
                                    </Row>
                                </>)}
                            </div>
                            <HR />
                            <div>
                                <div className={"ppwHead"}>Score Over Time</div>
                                <Graph data={[scorePlotData]} filled timeGraph />
                            </div>
                        </Tab>
                    </TabbedView>}
            </div>
        </Column>
    </Page>;
};
export default TeamPage;
