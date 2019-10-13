import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { transparentize } from "polished";

import { APIContext } from "../containers/controllers/Contexts";
import logo from "../static/wordmark_35px.png";

import theme from "theme";


const BrandLink = styled(Link)`
    font-size: 1.4em;
    font-weight: 500;
    color: ${theme.fg} !important;
`;

const HeadLink = styled(Link)`

    display: none;

    color: #ddd;
    padding: 0 15px;
    font-size: 14px;

    :hover {
        text-decoration: none;
        color: #fff;
    }
`;


const Head = styled.header`
    width: 100%;
    height: 60px;

    background-color: ${transparentize(.27, theme.bg_d1)};
    padding: 16px 32px;
    position: relative;
    z-index: 50;

    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;

    >* {
        flex-basis: 0;
        flex-grow: 1;
    }
`;

const HeadImg = styled.img`
    height: 35px;
`;

const LinkGroup = styled.div`
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 725px) {
        >* {
            display: none;
        }
    }
`;

const LinkGroupL = styled(LinkGroup)`
`;
const LinkGroupR = styled(LinkGroup)`
    justify-content: flex-end;
`;


export default () => (
    <Head>
        <LinkGroupL>
            <HeadLink to="/users">[ Users ]</HeadLink>
            <HeadLink to="/teams">[ Teams ]</HeadLink>
            <HeadLink to="/leaderboard">[ Leaderboard ]</HeadLink>
        </LinkGroupL>
        <BrandLink to="/"><HeadImg src={logo} /></BrandLink>
        <APIContext.Consumer>{api => <LinkGroupR>
            {1||api.authenticated ? <>
                <HeadLink to="/team">[ Team ]</HeadLink>
                <HeadLink to="/profile">[ Profile ]</HeadLink>
                <HeadLink to="/logout">[ Logout ]</HeadLink>
            </>
                : <HeadLink to="/login">[ Login ]</HeadLink>
            }
        </LinkGroupR>}</APIContext.Consumer>
    </Head>
);
