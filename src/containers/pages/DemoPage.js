import React from "react";
import styled from "styled-components";
import { transparentize, } from "polished";

import theme from "theme";


const PageHead = styled.div`
    width: 100%;
    background-color: ${transparentize(.27, theme.bg_d1)};
    padding: 64px;
    text-align: center;
    font-size: 2em;
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

`;

const DemoPage = (props) => {
    return (
        <>
            <PageHead>
                <HeadTitle>Demo Page</HeadTitle>
            </PageHead>
            <PageContent>
                <H1>This is a heading</H1>
            </PageContent>
        </>
    );
}
export default DemoPage;
