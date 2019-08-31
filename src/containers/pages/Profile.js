import React, { useContext } from "react";
import styled from "styled-components";

import admin from "../../static/img/admin.png";
import donor from "../../static/img/donor_large.png";
import beta from "../../static/img/beta.png";

import Page from "./bases/Page";
import { transparentize } from "polished";
import { APIContext } from "../controllers/API";
import theme from "theme";

const Split = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    &>:first-child {
        margin-right: 24px;
    }    

    @media (max-width: 700px) {
        flex-direction: column;
        align-items: center;

        &>:first-child {
            margin-bottom: 24px;
            margin-right: 0;
        }

        &>* {
            width: 100%;
        }
    }
`;

const PFP = styled.div`
    background-image: url(https://cdn.discordapp.com/avatars/161508165672763392/d49221388c0a50f8a7cbf4cb64b36eb6.png?size=2048);
    background-size: cover;
    border-radius: 24px;
    box-shadow: 0 2px 30px #0005;
    width: 256px;
    height: 256px;
    margin: auto;
    margin-bottom: 8px;
`;
const UserMeta = styled.div`
    line-height: 1.5;
    flex-shrink: 0;
    text-align: center;
`;
const UserSolves = styled.div`
    flex-grow: 1;
`;

const UserSpecial_ = styled.div`
    padding: 12px 16px;
    background-color: ${props => transparentize(.7, props.col)};
    border-radius: 21px;
    margin-bottom: 8px;
    width: 100%;
    text-align: left;
    display: flex;
`;
const USIcon = styled.div`
    width: 42px;
    height: 42px;
    border-radius: 21px;
    background-color: #fff3;
    margin: -12px -16px;
    margin-right: 8px;

    background-image: url(${props => props.ico});
    background-repeat: no-repeat;
    background-position: center;
`;

const UserSpecial = ({ children, col, ico }) => (
    <UserSpecial_ col={col}>
        <USIcon ico={ico} />
        {children}
    </UserSpecial_>
);

const UserSolve_ = styled.div`
    padding: 12px 16px;
    background-color: ${transparentize(.7, theme.bg_d1)};
    margin-bottom: 4px;
    width: 100%;
    text-align: left;
`;
const USTitle = styled.div`
    margin-bottom: 4px;
`;
const USPoints = styled.div`
    font-size: .8em;
`;
const UserSolve = ({ challenge }) => {
    const api = useContext(APIContext);
    // TODO: Properly API this.
    const points = "69696 points";
    const title = "Perculiar Post-it";

    return (
        <UserSolve_>
            <USTitle>{ title }</USTitle>
            <USPoints>{ points }</USPoints>
        </UserSolve_>
    )
}

export default () => {
    return <Page title={"Bottersnike's Profile"}>
        <Split>
            <UserMeta>
                <PFP />
                @Bottersnike#3605<br />
                6969 Points
            </UserMeta>
            <UserSolves>
                <UserSpecial col={"#66bb66"} ico={beta}>Beta Tester</UserSpecial>
                <UserSpecial col={"#bbbb33"} ico={donor}>Donor</UserSpecial>
                <UserSpecial col={"#bb6666"} ico={admin}>Admin</UserSpecial>

                <UserSolve />
                <UserSolve />
                <UserSolve />
            </UserSolves>
        </Split>
    </Page>;
}
