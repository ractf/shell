import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { BrokenShards } from "./ErrorPages";

import { useReactRouter } from "@ractf/util";
import {
    Spinner, FormError, Link, TabbedView, Tab, HR, ProgressBar, Row, Graph,
    Pie, Page
} from "@ractf/ui-kit";
import { useApi, api } from "ractf";
import { FaUsers, FaUser, FaTwitter, FaRedditAlien, FaDiscord } from "react-icons/fa";
import colours from "@ractf/ui-kit/Colours.scss";

import "./Profile.scss";


export default () => {
    /*
    const suffix = n => {
        let l = n.toString()[n.toString().length - 1];
        return l === "1" ? "st" : l === "2" ? "nd" : "rd";
    }
    const place = 1;
    */

    const { match } = useReactRouter();
    const categories = useSelector(state => state.challenges?.categories);
    const team = match.params.team;
    const [teamData, error] = useApi(api.ENDPOINTS.TEAM + (team === "me" ? "self" : team));
    const user = useSelector(state => state.user);

    window.td = teamData;

    if (user.team === null && team === "me") return <Redirect to={"/noteam"} />;

    const { t } = useTranslation();

    if (error) return <Page title={t("teams.teams")} centre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!teamData) return <Page title={t("teams.teams")} centre><Row><Spinner /></Row></Page>;

    const UserSolve = ({ solved_by_name, challenge_name, points }) => <div className={"userSolve"}>
        <div>{challenge_name}</div>
        <div>{t("teams.solve", { count: parseInt(points, 10), user_name: solved_by_name })}</div>
    </div>;

    const categoryValues = {};
    const userValues = {};
    const tData = teamData.solves.sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
    const scorePlotData = { x: [], y: [], name: "score", fill: "tozeroy" };
    // OPTIONAL: Use start time instead of first solve
    // scorePlotData.x.push(api.config.start_time);
    // scorePlotData.y.push(0);
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

        const score = (scorePlotData.y[scorePlotData.y.length - 1] || 0) + solve.points;
        scorePlotData.x.push(new Date(solve.timestamp));
        scorePlotData.y.push(score);
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
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"userName"}><FaUsers /> {teamData.name}</div>
                <div className={"userBio" + ((!teamData.description || teamData.description.length === 0)
                    ? " noBio" : "")}>
                    {teamData.description || t("teams.no_bio")}
                </div>

                {teamData.social && <>
                    {teamData.twitter && teamData.twitter.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://twitter.com/" + encodeURIComponent(teamData.twitter)}>
                            <FaTwitter /><span>@{teamData.twitter}</span>
                        </a>}
                    {teamData.reddit && teamData.reddit.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://reddit.com/u/" + encodeURIComponent(teamData.reddit)}>
                            <FaRedditAlien /><span>/u/{teamData.reddit}</span>
                        </a>}
                    {teamData.discord && teamData.discord.length !== 0 &&
                        (teamData.discordid && teamData.discordid.length !== 0
                            ? <a target={"_blank"}
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
            <div className={"userSolves"}>
                {(!teamData.solves || teamData.solves.length === 0) ? <div className={"noSolves"}>
                    {t("teams.no_solves", { name: teamData.name })}
                </div> : <TabbedView>
                        <Tab label={"Solves"}>
                            {teamData.solves && teamData.solves.map(i => <UserSolve key={i.timestamp} {...i} />)}
                        </Tab>
                        <Tab label={"Stats"}>
                            <div className={"ppwRow"}>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Solve attempts</div>
                                    <Pie data={[{
                                        values: [teamData.solves.length, teamData.incorrect_solves],
                                        labels: ["Correct", "Incorrect"],
                                        marker: {
                                            colors: [
                                                colours.bgreen,
                                                colours.red
                                            ]
                                        }
                                    }]} height={300} />
                                </div>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Category Breakdown</div>
                                    <Pie data={[{
                                        values: Object.values(categoryValues),
                                        labels: Object.keys(categoryValues),
                                    }]} height={281 + 19 * Object.keys(categoryValues).length} />
                                </div>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>User Breakdown</div>
                                    <Pie data={[{
                                        values: Object.values(userValues),
                                        labels: Object.keys(userValues),
                                    }]} height={281 + 19 * Object.keys(userValues).length} />
                                </div>
                            </div>
                            <HR />
                            <div>
                                <div className={"ppwHead"}>Category Progress</div>
                                {catProgress.map(([name, got, tot]) => <>
                                    <span style={{ fontWeight: 700 }}>{name}</span>
                                    <span style={{ fontSize: ".8em", marginLeft: 8 }}>
                                        {got}/{tot} ({Math.round(got / tot * 10000) / 100}%)
                                    </span>
                                    <Row>
                                        <ProgressBar thick progress={got / tot} width={"auto"} />
                                    </Row>
                                </>)}
                            </div>
                            <HR />
                            <div>
                                <div className={"ppwHead"}>Score Over Time</div>
                                <Graph data={[scorePlotData]} />
                            </div>
                        </Tab>
                    </TabbedView>}
            </div>
        </div>
    </Page>;
};
