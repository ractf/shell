import React from "react";

import admin from "../../static/img/admin.png";
import donor from "../../static/img/donor_large.png";
import beta from "../../static/img/beta.png";

import Page from "./bases/Page";
import { transparentize } from "polished";

import "./Profile.scss";


const UserSpecial = ({ children, col, ico }) => (
    <div className={"userSpecial"} style={{backgroundColor: transparentize(.7, col)}}>
        <div style={{backgroundImage: "url(" + ico + ")"}} />
        {children}
    </div>
);

const UserSolve = ({ challenge }) => {
    // TODO: Properly API this.
    const points = "69696 points";
    const title = "Perculiar Post-it";

    return (
        <div className={"userSolve"}>
            <div>{ title }</div>
            <div>{ points }</div>
        </div>
    )
}

export default () => {
    document.title = "Bottersnike"
    return <Page title={"Bottersnike's Profile"}>
        <div className={"profileSplit"}>
            <div className={"userMeta"}>
                <div className={"pfp"} />
                @Bottersnike#3605<br />
                6969 Points
            </div>
            <div className={"userSolves"}>
                <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>
                <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>
                <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>

                <UserSolve />
                <UserSolve />
                <UserSolve />
            </div>
        </div>
    </Page>;
}
