import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "../../components/Button";
import { HR, SectionTitle, SectionTitle2 } from "../../components/Misc";
import { APIContext } from "../controllers/API";

import Page from "./bases/Page";

const HomeSplit = styled.div`
    display: flex;
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

const Block = styled.div`
    margin: 25px 0;
    line-height: 1.8;
`;

export default () => {
    const api = useContext(APIContext);

    return <Page vCentre>
        
        <SectionTitle>Welcome to RACTF!</SectionTitle>
        <Block>
            To get started, head on over to the <Link to={"/campaign"}>challenges page</Link>!<br/>
            Alternatively, check the <Link to={"/leaderboard"}>leaderboard</Link> to see how everyone's getting on.
        </Block>

        <HomeSplit>
            <div>
                <SectionTitle2>News</SectionTitle2>
                <News />
            </div>
            <div>
                <SectionTitle2>Credits</SectionTitle2>
                <Credits />
            </div>
        </HomeSplit>

        <HR />
        <Button to={"/admin"} main>Admin Panel</Button>
    </Page>;
}
