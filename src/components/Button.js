import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

const Button = styled.button`
    background-color: #2c2a44;
    border-radius: 2px;
    border: 1px solid #373354;
    display: block;
    cursor: pointer;
    color: #fff;
    font-family: 'Roboto Mono',monospace;
    font-size: 1.2rem;
    padding: 5px 10px;
    text-decoration: none;
    transition: background-color 1s;
    margin: 1rem auto 0;

    ${props => props.main && css`
        padding: .6rem 2rem;
    `}
    ${props => props.medium && css`
        padding: 8px 15px;
    `}
    ${props => props.lesser && css`
        background: none;
    `}

    &:hover {
        background-color: #222034;
        text-decoration: none;
    }
`;
const NoUnderline = styled(Link)`
    && {
        text-decoration: none;
    }
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    >* {
        margin-right: 16px;
    }
    >*:last-child {
        margin-right: 0;
    }
`;

export default (props) =>
    props.to ?
        <NoUnderline to={props.to}>
            <Button onClick={props.click || (()=>{})} {...props}>{props.children}</Button>
        </NoUnderline>
        : <Button onClick={props.click || (()=>{})} {...props}>{props.children}</Button>
;
