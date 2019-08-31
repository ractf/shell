import React from "react";
import { transparentize } from "polished";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { FaLink } from "react-icons/fa";
import theme from "theme";


const PageHead = styled.div`
    width: 100%;
    background-color: ${transparentize(.27, theme.bg_d1)};
    padding: 48px;
    padding-bottom: 8px;
    ${props => props.minimal && css`
        padding-top: 0;
    `}
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
    flex-grow: 1;
    width: 100%;
    ${props => props.vCentre && css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
    `}
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

const FaLinkIcon = styled(FaLink)`
    font-size: .5em;
    color: ${theme.fg};
    margin-left: .4em;

    :hover {
        color: #ddd;
    }
`;

const LinkIcon = ({ url }) => {
    if (!url) return null;
    return <a href={url}>
        <FaLinkIcon />
    </a>;
};


const Page = ({ title, url, children, vCentre }) => {
    return (
        <>
            <PageHead minimal={!title || title.length === 0}>
                {title ? <HeadTitle>
                    {title}
                    {url ? <LinkIcon url={url} /> : null}
                </HeadTitle> : null}
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
            <PageContent vCentre={vCentre}>
                {children}
            </PageContent>
        </>
    );
}
export default Page;
