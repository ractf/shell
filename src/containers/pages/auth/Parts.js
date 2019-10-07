import styled from "styled-components";


export const EMAIL_RE = /^\S+@\S+\.\S+$/;


export const Wrap = styled.div`
    border: 1px solid #373354;
    background-color: #2c2a4455;
    max-width: 600px;
    width: 100%;
    margin: auto;
    padding: 56px 64px;
    padding-bottom: 48px;
    border-radius: 2px;

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


export const FormError = styled.div`
    color: #ac3232;
    font-weight: 500;
    font-size: 1.2em;
`;
