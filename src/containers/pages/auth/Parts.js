import React from "react";
import styled from "styled-components";

import { Spinner } from "ractf";
import theme from "theme";


export const EMAIL_RE = /^\S+@\S+\.\S+$/;


const WrapDiv = styled.div`
    max-width: 600px;
    width: 100%;
    margin: auto;
    padding: 56px 64px;
    padding-bottom: 48px;
    position: relative;

    @media only screen and (max-width: 600px) {
        padding: 56px 24px;
    }

    background-color: #292740;
    position: relative;
    color: ${theme.foregound};
    border-radius: 1px;

    &::before {
        position: absolute;
        left: 3px;
        height: 100%;
        top: 5px;
        width: 100%;
        content: "";
        display: block;
        background-color: ${theme.bg_d0};
        z-index: -1;
        border-radius: 1px;
        transition: 100ms top ease-out, 100ms left ease-out;
    }
`;

const Darken = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 50px #0005;
    background-color: #0005;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Wrap = ({ locked = false, children }) => {
    return <WrapDiv>
        { children }
        { locked && <Darken><Spinner /></Darken>}
    </WrapDiv>
}
