import React from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";

import NodeLink from "./NodeLink";

import * as plugin_theme from "../plugin_theme";
import { theme } from "ractf";


const ChalNode = styled.div`
    width: ${plugin_theme.node_size};
    padding-bottom: ${plugin_theme.node_size};
    box-sizing: content-box;
    border-radius: 5%;
    border: 4px solid ${theme.bg_l1};
    background-color: ${transparentize(.4, theme.bg)};
    position: relative;
    color: ${theme.fg};
    position: relative;

    @media (max-width: 600px) {
        border-width: 2px;
        font-size: .6em;
    }

    >*:first-child {
        position: absolute;
        font-size: ${props => props.largeName ? "2.4em" : "1.2em"};
        width: ${plugin_theme.node_inner};

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-height: 90%;
        overflow: hidden;
        overflow-wrap: break-word;

        z-index: 20;
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
    ${props => props.orange && css`
        border-color: #740;
    `}
`;


const LockRight = styled.div`
    &>svg {
        font-size: ${plugin_theme.icon_size};
        position: absolute;
        top: 50%;
        left: calc(120% + 4px);
        @media (max-width: 600px) {
            left: calc(120% + 2px);
        }
        transform: translate(-50%, -50%);

        color: ${props => props.lockDoneR ? "#6b6" : props.lockUnlockedR ? theme.bg_l3 : theme.bg_l2};
    }
`;


const LockDown = styled(LockRight)`
    &>svg {
        left: 50%;
        top: calc(120% + 4px);
        @media (max-width: 600px) {
            top: calc(120% + 2px);
        }
        color: ${props => props.lockDoneD ? "#6b6" : props.lockUnlockedD ? theme.bg_l3 : theme.bg_l2};
    }
`;


export default props => {
    const toggle = side => {
        return e => {
            if (props.isEdit) {
                e.preventDefault();
                e.stopPropagation();
                props.toggleLink(side);
            }
        };
    };

    return (
        <ChalNode tabIndex={props.unlocked || props.done ? "0" : ""} onMouseDown={(e => (e.target.click && e.target.click()))} onClick={(props.done || props.unlocked) ? props.click : null} {...props}>
            <div>{props.name}</div>

            {props.right && <LockRight {...props}>{props.lockDoneR ? <FaCheck /> : props.lockUnlockedR ? <FaLockOpen /> : <FaLock />}</LockRight>}
            {props.down && <LockDown {...props}>{props.lockDoneD ? <FaCheck /> : props.lockUnlockedD ? <FaLockOpen /> : <FaLock />}</LockDown>}

            <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('left')} isEdit={props.isEdit} show={props.left} left done={props.done} unlocked={props.unlocked} />
            <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('right')} isEdit={props.isEdit} show={props.right} right done={props.done} unlocked={props.unlocked} />
            <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('up')} isEdit={props.isEdit} show={props.up} up done={props.done} unlocked={props.unlocked} />
            <NodeLink onMouseDown={(e=>{e.preventDefault(); e.stopPropagation()})} onClick={toggle('down')} isEdit={props.isEdit} show={props.down} down done={props.done} unlocked={props.unlocked} />
        </ChalNode>
    );
};