import React from "react";
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';

import { transparentize } from "polished";
import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { Spinner, FormError, useApi, Link } from "ractf";

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

const UserSolve = ({ name, points, time }) => {
    const { t } = useTranslation();

    return (
        <div className={"userSolve"}>
            <div>{name}</div>
            <div>{t("profile.solve", {count: points})}</div>
        </div>
    );
};

export default () => {
    const { match } = useReactRouter();
    const { t } = useTranslation();
    const user = match.params.user;
    const [userData, error] = useApi("/members/" + (user === "me" ? "self" : user));

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
                    {userData.bio || t("profile.no_bio")}
                </div>

                {userData.social && <>
                    {userData.social.twitter && userData.social.twitter.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://twitter.com/" + encodeURIComponent(userData.social.twitter)}>
                            <FaTwitter /><span>@{userData.social.twitter}</span>
                        </a>}
                    {userData.social.reddit && userData.social.reddit.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"}
                            href={"https://reddit.com/u/" + encodeURIComponent(userData.social.reddit)}>
                            <FaRedditAlien /><span>/u/{userData.social.reddit}</span>
                        </a>}
                    {userData.social.discord && userData.social.discord.length !== 0 &&
                        (userData.social.discordid && userData.social.discordid.length !== 0
                            ? <a target={"_blank"}
                                href={"https://discordapp.com/users/" + encodeURIComponent(userData.social.discordid)}
                                className={"userSocial"}>
                                <FaDiscord /><span>{userData.social.discord}</span>
                            </a>
                            : <span className={"userSocial"}>
                                <FaDiscord /><span>{userData.social.discord}</span>
                            </span>)}
                </>}

                {userData.team && <Link to={"/team/" + userData.team.id} className={"teamMemberico"}>
                    <FaUsers /> {userData.team.name}
                </Link>}
            </div>
            <div className={"userSolves"}>
                {userData.is_beta &&
                    <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>}
                {userData.is_donor &&
                    <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>}
                {userData.is_admin &&
                    <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>}

                {userData.solves && userData.solves.map((i, n) => <UserSolve key={n} {...i} />)}
                {(!userData.solves || userData.solves.length === 0) && <div className={"noSolves"}>
                    {t("profile.no_solves", {name: userData.username})}
                </div>}
            </div>
        </div>
    </Page>;
};
