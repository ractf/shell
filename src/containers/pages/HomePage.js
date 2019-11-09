import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Page from "./bases/Page";

import { apiContext } from "ractf";
import theme from "theme";


const CardRow = styled.div`
    display: flex;
    flex-direction: row;
    &>* {
        height: 100%;
    }

    @media (max-width: 700px) {
        flex-direction: column;
    }
`;
const CardTypeLink = styled(Link)`
    background-color: #292740;
    position: relative;
    display: block;
    color: ${theme.foregound};
    padding: 16px;
    flex-grow: 1;
    margin: 16px;
    text-align: left;
    flex-basis: 0;
    border-radius: 1px;

    >* {
        margin-bottom: 8px;
    }

    &::before {
        position: absolute;
        left: 3px;
        height: 100%;
        top: 5px;
        width: 100%;
        content: "";
        display: block;
        background-color: ${theme.bg_d1};
        z-index: -1;
        border-radius: 1px;
        transition: 100ms top ease-out, 100ms left ease-out;
    }
    &:hover {
        text-decoration: none;
        color: ${theme.foregound};
    }
    cursor: pointer;

    &:hover::before, &:focus::before {
        left: 5px;
        top: 8px;
    }
`;
const CardTitle = styled.div`
    font-size: 1.3em;
    font-weight: 600;
    font-family: ${theme.title_stack};
`;
const HomeLead = styled.div`
    font-size: 3em;
    margin-bottom: 24px;
    font-family: ${theme.title_stack};

    @media (max-width: 700px) {
        margin-top: 16px;
        margin-bottom: 8px;
    }
`;


export default () => {
    const api = useContext(apiContext);

    return <Page vCentre>
        <HomeLead>Welcome to RACTF!</HomeLead>
        <CardRow>
            {api.user ? <>
                <CardTypeLink to={"/campaign"}>
                    <CardTitle>Get started on challenges</CardTitle>
                    <div>
                        With over 50 challenges, there's something for everyone!
                    </div>
                </CardTypeLink>
                <CardTypeLink to={"/leaderboard"}>
                    <CardTitle>Check the leaderboard</CardTitle>
                    <div>
                        Compare yourself to others, or just see how everyone is getting on!
                    </div>
                </CardTypeLink>
            </> : <>
                <CardTypeLink to={"/login"}>
                    <CardTitle>Login</CardTitle>
                    <div>
                        Been here before? Login to get the most out of the site!
                    </div>
                </CardTypeLink>
                <CardTypeLink to={"/register"}>
                    <CardTitle>Register</CardTitle>
                    <div>
                        If you want to solve challenges you're going to need to get yourself an account
                    </div>
                    </CardTypeLink>
                </>}
        </CardRow>
        <CardRow>
            <CardTypeLink to={"/users"}>
                <CardTitle>69 Users...</CardTitle>
                <div>
                    ...have solved 5 challenges, 72 times!
                </div>
            </CardTypeLink>
            <CardTypeLink to={"/teams"}>
                <CardTitle>32 Teams...</CardTitle>
                <div>
                    ...have an average of 2.3 members each!
                </div>
            </CardTypeLink>
            <CardTypeLink to={"/privacy"}>
                <CardTitle>420 people...</CardTitle>
                <div>
                    ...have viewed the privacy policy!
                </div>
            </CardTypeLink>
        </CardRow>
        {api.user && api.user.isAdmin &&
            <CardRow>
                <CardTypeLink to={"/admin"}>
                    <CardTitle>Admin Panel</CardTitle>
                    <div>
                        Look at you, you fancy admin. Go do your admin things, why don't you. smh.
                    </div>
                </CardTypeLink>
            </CardRow>
        }
    </Page>;
}
