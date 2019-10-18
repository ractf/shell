import React, { useContext } from "react";
import { transparentize } from "polished";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { FaLink } from "react-icons/fa";
import theme from "theme";
import { APIContext } from "../../controllers/Contexts";


const PageHead = styled.div`
    width: 100%;
    background-color: ${transparentize(.27, theme.bg_d1)};
    padding: 24px;
    @media (max-width: 600px) {
        padding: 4px
    }
    padding-bottom: 8px;
    ${props => props.minimal && css`
        padding-top: 0;
    `}
    text-align: center;
    font-size: 2em;
    position: relative;
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

    @media only screen and (max-width: 600px) {
        padding: 16px 32px;
    }
    @media only screen and (max-width: 450px) {
        padding: 16px 4px;
    }
`;
const HeadTitle = styled.div`
    margin-bottom: 36px;
    @media (max-width: 600px) {
        margin-bottom: 24px
    }
`;

const HeadLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;
const linkStyle = css`
    font-size: .9rem;
    padding: .2em .8em;
    color: #bbb;
    cursor: pointer;

    &:hover {
        color: #eee;
        text-decoration: none;
    }

    &:hover > ul {
        display: flex;
    }
`
const HeadLink = styled(Link)`
    ${ linkStyle}
`;
const HeadItem = styled.div`
    ${ linkStyle}
    position: relative;
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


const DropdownBody = styled.ul`
    position: absolute;
    flex-direction: column;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    padding: 8px 0;
    display: none;
    margin: 0;
    text-align: center;
    min-width: 100%;
    z-index: 100;

    &:hover {
        display: flex;
    }

    >* {
        margin: 2px 0;
    }

    background-color: ${transparentize(.27, theme.bg_d1)};
`;
const LinkDropdown = ({ name, children }) => {
    return <HeadItem style={{ position: "relative" }}>{name}
        <DropdownBody>
            {children}
        </DropdownBody>
    </HeadItem>
}


const Page = ({ title, url, children, vCentre }) => {
    const api = useContext(APIContext);

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

                    {api.authenticated
                        ? <>
                            <HeadLink to={"/campaign"}>Challenges</HeadLink>
                            <HeadLink to={"/team"}>My Team</HeadLink>
                            <LinkDropdown name={api.user.username}>
                                <HeadLink to={"/profile"}>Profile</HeadLink>
                                <HeadLink to={"/settings"}>Settings</HeadLink>
                            </LinkDropdown>
                            <HeadLink to={"/logout"}>Logout</HeadLink>
                        </>
                        : <HeadLink to={"/login"}>Login</HeadLink>}
                </HeadLinks>
            </PageHead>
            <PageContent vCentre={vCentre}>
                {children}
            </PageContent>
        </>
    );
}
export default Page;
