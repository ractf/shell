import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";
import { Link } from "react-router-dom";

import theme from "theme";


const PageHead = styled.div`
    width: 100%;
    background-color: ${transparentize(.27, theme.bg_d1)};
    padding: 48px;
    padding-bottom: 8px;
    text-align: center;
    font-size: 2em;
    position: relative;
`;
const H1 = styled.h1`
    font-weight: 500;
`;
const PageContent = styled.div`
    padding: 32px 64px;
    max-width: 1200px;
    margin: auto;
`;
const HeadTitle = styled.div`
    margin-bottom: 64px;
`;

const HeadLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const HeadLink = styled(Link)`
    font-size: .9rem;
    margin: .2em .8em;
    color: #bbb;
    cursor: pointer;

    &:hover {
        color: #eee;
        text-decoration: none;
    }
`;

const Page = (props) => {
    return (
        <>
            <PageHead>
                <HeadTitle>{ props.title }</HeadTitle>
                <HeadLinks>
                    <HeadLink to={"/users"}>Users</HeadLink>
                    <HeadLink to={"/teams"}>Teams</HeadLink>
                    <HeadLink to={"/leaderboard"}>Leaderboard</HeadLink>

                    <HeadLink to={"/campaign"}>Challenges</HeadLink>

                    <HeadLink to={"/profile"}>Profile</HeadLink>
                    <HeadLink to={"/team"}>My Team</HeadLink>
                    <HeadLink to={"/logout"}>Logout</HeadLink>
                </HeadLinks>
            </PageHead>
            <PageContent>
                { props.children }
            </PageContent>
        </>
    );
}
export default Page;
