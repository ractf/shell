import React from "react";
import Moment from 'react-moment';

import { transparentize } from "polished";
import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { Spinner, FormError, useApi, Link, ENDPOINTS } from "ractf";

import admin from "../../static/img/admin.png";
import donor from "../../static/img/donor_large.png";
import beta from "../../static/img/beta.png";

import "./Profile.scss";
import { FaTwitter, FaDiscord, FaRedditAlien, FaUsers } from "react-icons/fa";


const UserSpecial = ({ children, col, ico }) => (
    <div className={"userSpecial"} style={{ backgroundColor: transparentize(.7, col) }}>
        <div style={{ backgroundImage: "url(" + ico + ")" }} />
        {children}
    </div>
);

const UserSolve = ({ challenge_name, points }) => {
    return (
        <div className={"userSolve"}>
            <div>{challenge_name}</div>
            <div>{points} point{points === 1 ? "" : "s"}</div>
        </div>
    );
};

export default () => {
    const { match } = useReactRouter();
    const user = match.params.user;
    const [userData, error] = useApi(ENDPOINTS.USER + (user === "me" ? "self" : user));

    if (error) return <Page title={"Users"} vCentre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!userData) return <Page title={"Users"} vCentre><Spinner /></Page>;

    return <Page title={userData.username}>
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"userName"}>{userData.username}</div>
                <div className={"userJoined"}>Joined <Moment fromNow>{userData.joined}</Moment></div>
                <div className={"userBio" + ((!userData.bio || userData.bio.length === 0) ? " noBio" : "")}>
                    {userData.bio}
                </div>

                {userData.social && <>
                    {userData.twitter && userData.twitter.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://twitter.com/" + encodeURIComponent(userData.twitter)}>
                            <FaTwitter /><span>@{userData.twitter}</span>
                        </a>}
                    {userData.reddit && userData.reddit.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://reddit.com/u/" + encodeURIComponent(userData.reddit)}>
                            <FaRedditAlien /><span>/u/{userData.reddit}</span>
                        </a>}
                    {userData.discord && userData.discord.length !== 0 &&
                        (userData.discordid && userData.discordid.length !== 0
                            ? <a target={"_blank"}
                                href={"https://discordapp.com/users/" + encodeURIComponent(userData.discordid)}
                                className={"userSocial"}>
                                <FaDiscord /><span>{userData.discord}</span>
                            </a>
                            : <span className={"userSocial"}>
                                <FaDiscord /><span>{userData.discord}</span>
                            </span>)}
                </>}

                {userData.team && <Link to={"/team/" + (userData.team.id || userData.team)} className={"teamMemberico"}>
                    <FaUsers /> {userData.team_name}
                </Link>}
            </div>
            <div className={"userSolves"}>
                {userData.is_beta &&
                    <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>}
                {userData.is_donor &&
                    <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>}
                {userData.is_staff &&
                    <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>}

                {userData.solves && userData.solves.map((i, n) => <UserSolve key={n} {...i} />)}
                {(!userData.solves || userData.solves.length === 0) && <div className={"noSolves"}>
                    {userData.username} hasn't solved any challenges yet
                </div>}
            </div>
        </div>
    </Page>;
};
