import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";
import { transparentize } from "polished";

import logo from "../static/wordmark_35px.png";

import theme from "theme";


const BrandLink = styled(Link)`
    font-size: 1.4em;
    font-weight: 500;
    color: ${theme.fg} !important;
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


export default () => (
    <Head>
        <BrandLink to="/"><HeadImg src={logo} /></BrandLink>
    </Head>
);
