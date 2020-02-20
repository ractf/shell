import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { Spinner, FormError, useApi, Link, apiContext, ENDPOINTS } from "ractf";
import { FaUsers, FaUser, FaTwitter, FaRedditAlien, FaDiscord } from "react-icons/fa";

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
    const team = match.params.team;
    const api = useContext(apiContext);
    const [teamData, error] = useApi(ENDPOINTS.TEAM + (team === "me" ? "self" : team));

    if (api.user.team === null) return <Redirect to={"/noteam"} />;

    if (error) return <Page title={"Teams"} vCentre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!teamData) return <Page title={"Teams"} vCentre><Spinner /></Page>;

    const UserSolve = ({ user_name, name, score }) => <div className={"userSolve"}>
        <div>{name}</div>
        <div>{score} point{score === 1 ? "" : "s"} - Scored by {user_name}</div>
    </div>;

    return <Page title={teamData.name}>
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"userName"}><FaUsers /> {teamData.name}</div>
                <div className={"userBio" + ((!teamData.description || teamData.description.length === 0)
                    ? " noBio" : "")}>
                    {teamData.description}
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
                    <FaUser /> {i.name}
                </Link><br /></>)}
            </div>
            <div className={"userSolves"}>
                {teamData.solves && teamData.solves.map(i => <UserSolve key={i.solve_timestamp} {...i} />)}
                {(!teamData.solves || teamData.solves.length === 0) && <div className={"noSolves"}>
                    {teamData.name} haven't solved any challenges yet
                </div>}
            </div>
        </div>
    </Page>;
};
