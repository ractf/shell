import React, { useContext, useEffect, useState } from "react";

import { transparentize } from "polished";
import { BrokenShards } from "./ErrorPages";
import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { apiContext, Spinner, FormError } from "ractf";

import admin from "../../static/img/admin.png";
import donor from "../../static/img/donor_large.png";
import beta from "../../static/img/beta.png";

import "./Profile.scss";
import { FaTwitter, FaDiscord, FaRedditAlien } from "react-icons/fa";


const UserSpecial = ({ children, col, ico }) => (
    <div className={"userSpecial"} style={{ backgroundColor: transparentize(.7, col) }}>
        <div style={{ backgroundImage: "url(" + ico + ")" }} />
        {children}
    </div>
);

const UserSolve = ({ challenge }) => {
    // TODO: Properly API this.
    const points = "69696 points";
    const title = "Perculiar Post-it";

    return (
        <div className={"userSolve"}>
            <div>{title}</div>
            <div>{points}</div>
        </div>
    )
}

export default () => {
    const api = useContext(apiContext);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const { match } = useReactRouter();
    const user = match.params.user;

    useEffect(() => {
        api.getUser(user).then(data => {
            setUserData(data.d);
        }).catch(e => {
            let error = api.getError(e)
            setUserData(api.user)
            setError(error)
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (error) return <Page title={"Users"} vCentre>
        <FormError>{error}</FormError>
        <BrokenShards />
    </Page>;
    if (!userData) return <Page title={"Users"} vCentre><Spinner /></Page>;

    console.log(userData);

    return <Page title={userData.username}>
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"userName"}>{userData.username}</div>
                <div className={"userJoined"}>Joined Yesterday</div>
                <div className={"userBio noBio"}></div>

                {user.twitter &&
                    <a className={"userSocial"} target={"_blank"} href={"https://twitter.com/" + user.twitter}><FaTwitter /><span>@{user.twitter}</span></a>}
                {user.reddot &&
                    <a className={"userSocial"} target={"_blank"} href={"https://reddit.com/u/" + user.reddit}><FaRedditAlien /><span>/u/{user.reddit}</span></a>}
                {user.discord &&
                    <span className={"userSocial"}><FaDiscord /><span>{user.discord}</span></span>}
            </div>
            <div className={"userSolves"}>
                {userData.is_beta &&
                    <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>}
                {userData.is_donor &&
                    <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>}
                {userData.is_admin &&
                    <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>}

                <UserSolve />
                <UserSolve />
                <UserSolve />
            </div>
        </div>
    </Page>;
}
