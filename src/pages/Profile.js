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
import Moment from "react-moment";
import { useTranslation } from "react-i18next";

import { BrokenShards } from "./ErrorPages";

import { useReactRouter, useConfig } from "@ractf/util";
import {
    FormError, Link, TabbedView, Tab, HR, Graph, Pie, Page, Column, Badge, Row
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { useApi } from "ractf";
import LoadingPage from "./LoadingPage";

import colours from "@ractf/ui-kit/Colours.scss";

import "./Profile.scss";
import { FaTwitter, FaDiscord, FaRedditAlien, FaUsers } from "react-icons/fa";
import { useCategories } from "@ractf/util/hooks";


const UserSolve = ({ challenge_name, points }) => {
    const { t } = useTranslation();

    return (
        <div className={"userSolve"}>
            <div>{challenge_name}</div>
            <div>{t("point_count", { count: points })}</div>
        </div>
    );
};

const Profile = () => {
    const { match } = useReactRouter();
    const { t } = useTranslation();
    const user = match.params.user;
    const categories = useCategories();
    const [userData, error] = useApi(ENDPOINTS.USER + (user === "me" ? "self" : user));
    const hasTeams = useConfig("enable_teams");

    if (error) return <Page title={"Users"} centre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!userData) return <LoadingPage title={"Users"} />;

    const categoryValues = {};
    const uData = userData.solves.filter(Boolean).sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
    const scorePlotData = { x: [], y: [], name: "score", fill: "tozeroy" };
    // OPTIONAL: Use start time instead of first solve
    // scorePlotData.x.push(api.config.start_time);
    // scorePlotData.y.push(0);
    uData.forEach(solve => {
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

        const score = (scorePlotData.y[scorePlotData.y.length - 1] || 0) + solve.points;
        scorePlotData.x.push(new Date(solve.timestamp));
        scorePlotData.y.push(score);
    });

    return <Page title={userData.username}>
        <Column xlWidth={3} lgWidth={4} mdWidth={12}>
            <div className={"userMeta"}>
                <div className={"userName"}>{userData.username}</div>
                {(userData.is_staff || userData.is_verified || userData.state_actor) && <Row tight>
                    {userData.is_staff && <Badge danger pill>Admin</Badge>}
                    {userData.is_verified && <Badge warning pill>Staff</Badge>}
                    {userData.state_actor && <Badge primary pill>State Actor</Badge>}
                </Row>}
                <div>{t("point_count", { count: userData.leaderboard_points })}</div>
                <div className={"userJoined"}>Joined <Moment fromNow>{new Date(userData.date_joined)}</Moment></div>
                <div className={"userBio" + ((!userData.bio || userData.bio.length === 0) ? " noBio" : "")}>
                    {userData.bio || t("profile.no_bio")}
                </div>

                {userData.twitter && userData.twitter.length !== 0 &&
                    <a className={"userSocial"} target={"_blank"} rel={"noopener noreferrer"}
                        href={"https://twitter.com/" + encodeURIComponent(userData.twitter)}>
                        <FaTwitter /><span>@{userData.twitter}</span>
                    </a>}
                {userData.reddit && userData.reddit.length !== 0 &&
                    <a className={"userSocial"} target={"_blank"} rel={"noopener noreferrer"}
                        href={"https://reddit.com/u/" + encodeURIComponent(userData.reddit)}>
                        <FaRedditAlien /><span>/u/{userData.reddit}</span>
                    </a>}
                {userData.discord && userData.discord.length !== 0 &&
                    (userData.discordid && userData.discordid.length !== 0
                        ? <a target={"_blank"} rel={"noopener noreferrer"}
                            href={"https://discordapp.com/users/" + encodeURIComponent(userData.discordid)}
                            className={"userSocial"}>
                            <FaDiscord /><span>{userData.discord}</span>
                        </a>
                        : <span className={"userSocial"}>
                            <FaDiscord /><span>{userData.discord}</span>
                        </span>)}

                {hasTeams && userData.team && (
                    <Link to={"/team/" + (userData.team.id || userData.team)} className={"teamMemberico"}>
                        <FaUsers /> {userData.team_name}
                    </Link>
                )}
                {Object.keys(categoryValues).length !== 0 && <>
                    <div className={"profilePieWrap"}>
                        <div className={"ppwHead"}>Solve attempts</div>
                        <Pie data={[userData.solves.filter(Boolean).length, userData.incorrect_solves]}
                            labels={["Correct", "Incorrect"]}
                            colors={[colours.green, colours.red]} />
                    </div>
                </>}
            </div>
        </Column>
        <Column xlWidth={9} lgWidth={8} mdWidth={12}>
            <div className={"userSolves"}>
                {(!userData.solves || userData.solves.filter(Boolean).length === 0) ? <div className={"noSolves"}>
                    {t("profile.no_solves", { name: userData.username })}
                </div> : <TabbedView>
                        <Tab label={"Solves"}>
                            {userData.solves && userData.solves.filter(Boolean).map((i, n) => (
                                <UserSolve key={i.timestamp} {...i} />
                            ))}
                        </Tab>
                        <Tab label={"Stats"}>
                            <div className={"ppwRow"}>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Solve attempts</div>
                                    <Pie data={[userData.solves.filter(Boolean).length, userData.incorrect_solves]}
                                        colors={[colours.green, colours.red]}
                                        labels={["Correct", "Incorrect"]} height={300} />
                                </div>
                                <div className={"profilePieWrap"}>
                                    <div className={"ppwHead"}>Category Breakdown</div>
                                    <Pie data={Object.values(categoryValues)}
                                        labels={Object.keys(categoryValues)} />
                                </div>
                            </div>
                            <HR />
                            <div>
                                <div className={"ppwHead"}>Score Over Time</div>
                                <Graph data={[scorePlotData]} />
                            </div>
                        </Tab>
                    </TabbedView>}
            </div>
        </Column>
    </Page>;
};
export default Profile;
