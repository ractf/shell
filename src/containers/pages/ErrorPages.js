import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const ErrorWrap = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    &>div:first-child {
        font-size: 7em;
        font-weight: 500;
    }
    &>div:nth-child(2) {
        font-size: 1.5em;
        font-weight: 500;
    }
    &>*:last-child {
        margin-top: 16px;
        font-size: 1.2em;
        font-weight: 400;
    }
`;


export const ErrorPage = (props) => <ErrorWrap>
    <div>{props.code || "Something went wrong"}</div>
    <div>{props.details}</div>
    <Link to={"/"}>Back to safety</Link>
</ErrorWrap>;

export const NotFound = () => <ErrorPage code={404} details={"Page not found"} />
