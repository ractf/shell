import React from "react";
import styled from "styled-components";

import Button, { ButtonRow } from "../../components/Button";
import { HR, SectionTitle } from "../../components/Misc";
import { APIContext } from "../controllers/API";

const HomeSplit = styled.div`
    display: flex;
    flex-grow: 1;
    align-items: center;
    width: 100%;
    max-width: 1400px;

    >* {
        flex-basis: 0;
        flex-grow: 1;
    }
`;

const News = () => <>
    No news at this time<br /><br />
</>;

const Credits = () => <>
    Cache not implemented.<br /><br />//TODO: This
</>;

export default () =>
    <APIContext.Consumer>{api =>
        <HomeSplit>
            <div>
                <SectionTitle>Welcome, { api.user.username }</SectionTitle>
                <Button to={"/campaign"} main>Continue Challenges</Button>
                <Button to={"/leaderboard"} main>View Leaderboard</Button>
                <ButtonRow>
                    <Button to={"/support"} main lesser>Support</Button>
                    <Button to={"/settings"} main lesser>Settings</Button>
                </ButtonRow>
                <HR />
                <Button to={"/admin"} main>Admin Panel</Button>
            </div>
            <div>
                <SectionTitle>News</SectionTitle>
                <News />
                <SectionTitle>Credits</SectionTitle>
                <Credits />
            </div>
        </HomeSplit>
    }</APIContext.Consumer>;
