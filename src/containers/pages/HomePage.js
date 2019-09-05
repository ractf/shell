import React, { useContext } from "react";
import { transparentize } from "polished";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button, { ButtonRow } from "../../components/Button";
import { HR, SectionTitle, SectionTitle2 } from "../../components/Misc";
import { APIContext } from "../controllers/API";

import Page from "./bases/Page";

import theme from "theme";

const NewsContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 1400px;
    border-radius: 2px;
    flex-direction: row;
    height: 150px;
    align-items: center;
    background-color: #2c2a4455;

    >* {
        flex-basis: 0;
        flex-grow: 1;
    }
`;

const NewsTitle = styled.div`
    width: 100px;
    float: left;
    margin: 0 50px;
    font-size: 48px;
    flex-grow: 0;
`;

const NewsFlexbox = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    text-align: center;
    width: 100%;
`;

const NewsBlock = styled.div`
    border: 1px solid ${theme.bg_d1};
    border-radius: 2px;
    padding: 10px 25px;
    margin: 10px 25px;
`;

const News1 = () => <>
    This is some news
</>;

const News2 = () => <>
    Even more news
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

        <NewsContainer>
                <NewsTitle>News</NewsTitle>
            <div>
                <NewsFlexbox>
                    <NewsBlock><News1 /></NewsBlock>
                    <NewsBlock><News2 /></NewsBlock>
                </NewsFlexbox>
            </div>
        </NewsContainer>

        <HR />
        <Button to={"/admin"} main>Admin Panel</Button>
    </Page>;
}
