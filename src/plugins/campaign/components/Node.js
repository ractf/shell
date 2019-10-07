import React from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";

import NodeLink from "./NodeLink";

import * as plugin_theme from "../plugin_theme";
import { theme } from "ractf";


const ChalNode = styled.div`
    width: ${plugin_theme.node_size};
    height: ${plugin_theme.node_size};
    border-radius: 50%;
    border: 4px solid ${theme.bg_l1};
    background-color: ${transparentize(.4, theme.bg)};
    position: relative;
    color: ${theme.fg};
    padding: 16px;

    >*:first-child {
        position: relative;
        font-size: 1.2em;
        width: ${plugin_theme.node_inner};

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        z-index: 50;
        color: ${theme.fg};
        font-weight: 400;
    }
    +div::after, +div::before {
        background-color: ${theme.bg_l1};
    }
    margin: 0 ${plugin_theme.node_margin};
    &:first-child {
        margin-left: 0;
    }
    &:last-child {
        margin-right: 0;
    }

    ${props => !(props.done || props.unlocked) ? css`
        color: ${theme.bg_l2};
        user-select: none;
    ` : css`
        cursor: pointer;
        color: ${theme.bg_l3};
        border-color: ${theme.bg_l3};

        &:hover {
            background-color: ${transparentize(.67, theme.bg_l1)};
        }
    `}

    ${props => props.done && css`
        border-color: #6b6;
        color: #6b6;
        
        &:hover {
            background-color: #66bb6633;
        }
    `}
`;


const LockRight = styled.div`
    &>svg {
        font-size: ${plugin_theme.icon_size};
        position: absolute;
        top: 50%;
        left: calc(100% + ${plugin_theme.node_margin} + 4px);
        transform: translate(-50%, -50%);

        color: ${props => props.lockDoneR ? "#6b6" : props.lockUnlockedR ? theme.bg_l3 : theme.bg_l2};
    }
`;


const LockDown = styled(LockRight)`
    &>svg {
        left: 50%;
        top: calc(100% + ${plugin_theme.node_margin} + 4px);
        color: ${props => props.lockDoneD ? "#6b6" : props.lockUnlockedD ? theme.bg_l3 : theme.bg_l2};
    }
`;


export default props => {
    return (
        <ChalNode tabIndex={props.unlocked || props.done ? "0" : ""} onMouseDown={(e => (e.target.click && e.target.click()))} onClick={(props.done || props.unlocked) ? props.click : null} {...props}>
            <div>{props.name}</div>

            {props.right && <LockRight {...props}>{props.lockDoneR ? <FaCheck /> : props.lockUnlockedR ? <FaLockOpen /> : <FaLock />}</LockRight>}
            {props.down && <LockDown {...props}>{props.lockDoneD ? <FaCheck /> : props.lockUnlockedD ? <FaLockOpen /> : <FaLock />}</LockDown>}

            {props.left && <NodeLink left done={props.done} unlocked={props.unlocked} />}
            {props.right && <NodeLink right done={props.done} unlocked={props.unlocked} />}
            {props.up && <NodeLink up done={props.done} unlocked={props.unlocked} />}
            {props.down && <NodeLink down done={props.done} unlocked={props.unlocked} />}
        </ChalNode>
    );
};