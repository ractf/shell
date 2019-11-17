import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { apiContext, Spinner, FormError } from "ractf";
import { FaUsers, FaUser, FaTwitter, FaRedditAlien, FaDiscord } from "react-icons/fa";

import "./Profile.scss";


export default () => {
    const api = useContext(apiContext);
    /*
    const suffix = n => {
        let l = n.toString()[n.toString().length - 1];
        return l === "1" ? "st" : l === "2" ? "nd" : "rd";
    }
    const place = 1;
    */

    const [teamData, setTeamData] = useState(null);
    const [error, setError] = useState(null);
    const { match } = useReactRouter();
    const team = match.params.team;

    useEffect(() => {
        api.getTeam(team).then(data => {
            setTeamData(data.d);
        }).catch(e => {
            let error = api.getError(e)
            setError(error) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [team]);

    if (error) return <Page title={"Teams"} vCentre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!teamData) return <Page title={"Teams"} vCentre><Spinner /></Page>;

    // TODO: This properly later
    const UserSolve = () => null;

    return <Page title={teamData.name}>
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"userName"}><FaUsers /> {teamData.name}</div>
                <div className={"userBio" + ((!teamData.description || teamData.description.length === 0) ? " noBio" : "")}>
                    {teamData.description}
                </div>

                {teamData.social && <>
                    {teamData.social.twitter && teamData.social.twitter.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"} href={"https://twitter.com/" + encodeURIComponent(teamData.social.twitter)}><FaTwitter /><span>@{teamData.social.twitter}</span></a>}
                    {teamData.social.reddit && teamData.social.reddit.length !== 0 &&
                        <a className={"userSocial"} target={"_blank"} href={"https://reddit.com/u/" + encodeURIComponent(teamData.social.reddit)}><FaRedditAlien /><span>/u/{teamData.social.reddit}</span></a>}
                    {teamData.social.discord && teamData.social.discord.length !== 0 &&
                        (teamData.social.discordid && teamData.social.discordid.length !== 0
                            ? <a target={"_blank"} href={"https://discordapp.com/users/" + encodeURIComponent(teamData.social.discordid)} className={"userSocial"}><FaDiscord /><span>{teamData.social.discord}</span></a>
                            : <span className={"userSocial"}><FaDiscord /><span>{teamData.social.discord}</span></span>)}
                </>}

                {teamData.members.map((i, n) => <Link to={"/profile/" + i.id} className={"teamMemberico"} key={n}>
                    <FaUser /> { i.name }
                </Link>)}
            </div>
            <div className={"userSolves"}>
                {/*{teamData.is_beta &&
                    <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>}
                {teamData.is_donor &&
                    <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>}
                {teamData.is_admin &&
                <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>}*/}

                {teamData.solves && teamData.solves.map(i => <UserSolve {...i} />)}
                {(!teamData.solves || teamData.solves.length === 0) && <div className={"noSolves"}>{teamData.name} haven't solved any challenges yet</div>}
            </div>
        </div>
    </Page>
}
