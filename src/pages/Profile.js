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

import React from "react";
import Moment from "react-moment";
import { useTranslation } from "react-i18next";
import { FaRedditAlien } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import { FiTwitter, FiUsers } from "react-icons/fi";

import { cssVar, useReactRouter } from "@ractf/util";
import { useConfig, useCategories } from "@ractf/shell-util";
import {
    Graph, Pie, Page, Column, Badge, Form, Container, Grid, SubtleText
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { useApi } from "@ractf/util/http";

import * as dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";
import * as localizedFormat from "dayjs/plugin/localizedFormat";
import Link from "components/Link";

import LoadingPage from "./LoadingPage";
import { BrokenShards } from "./ErrorPages";
import "./Profile.scss";


dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);


const Profile = () => {
    const { match } = useReactRouter();
    const { t } = useTranslation();
    const user = match.params.user;
    const categories = useCategories();
    const [userData, error] = useApi(ENDPOINTS.USER + (user === "me" ? "self" : user));
    const hasTeams = useConfig("enable_teams");

    if (error) return <Page title={"Users"} centre>
        <Form.Error>{error}</Form.Error>
        <BrokenShards />
    </Page>;
    if (!userData) return <LoadingPage title={"Users"} />;

    const categoryValues = {};
    const uData = userData.solves.filter(Boolean).sort((a, b) => (new Date(a.timestamp)) - (new Date(b.timestamp)));
    const scorePlotData = { data: [], name: "score", fill: true };
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

        const score = ((scorePlotData.data[scorePlotData.data.length - 1] || {}).y || 0) + solve.points;
        scorePlotData.data.push({ x: new Date(solve.timestamp), y: score });
    });

    const bannerFg = userData.is_staff
        ? "var(--type-danger-fg)"
        : userData.is_verified
            ? "var(--type-warning-fg)"
            : undefined;
    const bannerBg = userData.is_staff
        ? "var(--type-danger-bg)"
        : userData.is_verified
            ? "var(--type-warning-bg)"
            : undefined;

    const hasSocialsRow = (
        (hasTeams && userData.team)
        || userData.reddit || userData.discord || userData.twitter
    );

    return <Page title={userData.username} noWrap>
        <div style={{ position: "relative" }}>
            <div className={"profileBack"} style={{
                backgroundColor: bannerBg, color: bannerFg
            }} />
            <Container className={"profileRow"}>
                {userData.profilePicture && (
                    <img alt={"Avatar"} src={userData.profilePicture} className={"pfp"} />
                )}
                <div className={"profileBanner"} style={{ color: bannerFg }}>
                    <h2>{userData.username}</h2>
                    <Container full spaced={!userData.bio}>
                        {t("point_count", { count: userData.leaderboard_points })}
                        <span className={"profileSep"} />
                        Joined <Moment fromNow>{new Date(userData.date_joined)}</Moment>
                    </Container>
                    {userData.bio && <Container full spaced><SubtleText>
                        {userData.bio}
                    </SubtleText></Container>}
                    <Container full toolbar spaced>
                        {userData.is_staff && <Badge danger pill outline>Admin</Badge>}
                        {userData.is_verified && <Badge warning pill outline={!userData.is_staff}>
                            Staff
                        </Badge>}
                    </Container>
                    {hasSocialsRow && (
                        <Container full toolbar className={"socialsRow"}>
                            {hasTeams && userData.team && (
                                <Link to={"/team/" + (userData.team.id || userData.team)}>
                                    <FiUsers /> {userData.team_name}
                                </Link>
                            )}
                            {userData.twitter && (
                                <a target={"_blank"} rel={"noopener noreferrer"}
                                    href={"https://twitter.com/" + encodeURIComponent(userData.twitter)}>
                                    <FiTwitter /><span>@{userData.twitter}</span>
                                </a>
                            )}
                            {userData.reddit && (
                                <a target={"_blank"} rel={"noopener noreferrer"}
                                    href={"https://reddit.com/u/" + encodeURIComponent(userData.reddit)}>
                                    <FaRedditAlien /><span>/u/{userData.reddit}</span>
                                </a>
                            )}
                            {userData.discord && (
                                userData.discordid && userData.discordid.length !== 0
                                    ? <a target={"_blank"} rel={"noopener noreferrer"}
                                        href={"https://discord.com/users/" + encodeURIComponent(userData.discordid)}>
                                        <SiDiscord /><span>{userData.discord}</span>
                                    </a>
                                    : <span>
                                        <SiDiscord /><span>{userData.discord}</span>
                                    </span>
                            )}
                        </Container>
                    )}
                </div>
            </Container>
        </div>
        <Container>
            {userData.solves.filter(Boolean).length ? <>
                <Container.Row>
                    <Column lgWidth={6}>
                        <h5>Solve attempts</h5>
                        <Pie data={[userData.solves.filter(Boolean).length, userData.incorrect_solves]}
                            colors={[cssVar("--col-green"), cssVar("--col-red")]}
                            labels={["Correct", "Incorrect"]} noAnimate />
                    </Column>
                    <Column lgWidth={6}>
                        <h5>Category Breakdown</h5>
                        <Pie data={Object.values(categoryValues)}
                            labels={Object.keys(categoryValues)} noAnimate />
                    </Column>
                </Container.Row>
                <h4>Score Over Time</h4>
                <Graph data={[scorePlotData]} timeGraph />
                <h4>Challenge Solves</h4>
                <Grid headings={["Challenge", "Points", "Time"]} data={userData.solves.filter(Boolean).map((i, n) => [
                    i.challenge_name, i.points, <span title={dayjs(i.timestamp).format("lll")}>
                        {dayjs(i.timestamp).fromNow()}
                    </span>
                ])} />
            </> : <>
                    <h5>{t("profile.no_solves", { name: userData.username })}</h5>
                </>}
        </Container>
    </Page>;
};
export default Profile;
