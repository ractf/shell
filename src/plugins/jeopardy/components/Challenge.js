import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import { theme } from "ractf";


const JCTheme = styled.div`
    padding: 2rem 16px;
    width: 300px;
    margin-bottom: 32px;
    margin-right: 32px;
    font-size: 1.2rem;
    text-align: center;

    border-radius: 2px;
    display: inline-block;
    background-color: ${props => props.done ? transparentize(.3, theme.green) : theme.bg};
    border: 1px solid ${props => props.done ? theme.green : theme.bg_d1};
    word-wrap: break-word;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &>span {
        z-index: 1;
        position: relative;
    }

    &::before {
        content: "";
        display: block;
        width: 0;
        padding-bottom: 0;
        background-color: ${props => props.done ? transparentize(.2, theme.green) : theme.bg_l1};
        position: absolute;
        left: 0;
        top: 100%;
        transform: translate(-50%, -50%);
        border-radius: 50%;

        transition: width 500ms ease, padding-bottom 500ms ease;
    }
    &:hover::before {
        width: 250%;
        padding-bottom: 250%;
    }

    &::after {
        content: "${props => props.points}";
        display: block;
        position: absolute;
        right: 12px;
        bottom: 6px;
        z-index: 1;
        font-size: .8em;
        color: ${theme.bg_l3}
    }
`;

export default ({ name, done, click, points }) => {
    return <JCTheme onMouseDown={(e => (e.target.click && e.target.click()))} onClick={done ? click : null} done={done} points={points}>
        <span>{name}</span>
    </JCTheme>;
}
