import React from "react";
import styled from "styled-components";

import { Spinner } from "ractf";


export const EMAIL_RE = /^\S+@\S+\.\S+$/;


const WrapDiv = styled.div`
    border: 1px solid #373354;
    background-color: #2c2a4455;
    max-width: 600px;
    width: 100%;
    margin: auto;
    padding: 56px 64px;
    padding-bottom: 48px;
    border-radius: 2px;
    position: relative;

    >div {
        margin-bottom: 16px;
    }
    >div:last-child {
        margin-bottom: 0;
    }
    >div:nth-last-child(2) {
        margin-bottom: 8px;
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


export const FormError = styled.div`
    color: #ac3232;
    font-weight: 500;
    font-size: 1.2em;
`;
