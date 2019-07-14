import React from "react";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const ErrorWrap = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ErrorMain = styled.div`
    font-size: 7em;
    font-weight: 500;
`;
const ErrorSub = styled.div`
    font-size: 1.5em;
    font-weight: 500;
`;
const ErrorLink = styled(Link)`
    margin-top: 16px;
    font-size: 1.2em;
    font-weight: 400;
`;

const ErrorPage = (props) => <ErrorWrap>
    <ErrorMain>{props.code || "Something went wrong"}</ErrorMain>
    <ErrorSub>{props.details}</ErrorSub>
    <ErrorLink to={"/"}>Back to safety</ErrorLink>
</ErrorWrap>;

const NotFound = () => <ErrorPage code={404} details={"Page not found"} />

export { ErrorPage, NotFound };
