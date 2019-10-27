import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { transparentize } from "polished";

import theme from "theme";


const ButtonTheme = styled.button`
    background-color: #2c2a44;
    border-radius: 2px;
    border: 1px solid #373354;
    display: block;
    cursor: pointer;
    color: ${theme.fg};
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
    ${props => props.warning && css`
        background: ${transparentize(.7, theme.red)};
        border-color: ${transparentize(.6, theme.red)};
    `}

    ${props => props.disabled ? css`
        color: #999;
        cursor: not-allowed;
    ` : css`
        &:hover {
            background-color: ${theme.bg};
            text-decoration: none;
        }
    `}
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
        margin-left: 0;
        margin-right: 16px;
    }
    >*:last-child {
        margin-right: 0;
    }

`;

const Button = (props, ref) => {
    const clickFunc = () => {
        if (props.click)
            props.click();
        if (props.form && props.form.callback)
            props.form.callback();
    }
    return (props.to ?
            <NoUnderline to={props.to} onMouseDown={(e => e.target.click())}>
                <ButtonTheme ref={ref} onMouseDown={props.to && (e => e.target.click())} onClick={clickFunc} {...props}>{props.children}</ButtonTheme>
            </NoUnderline>
            : <ButtonTheme ref={ref} onMouseDown={props.to && (e => e.target.click())} onClick={clickFunc} {...props}>{props.children}</ButtonTheme>
    );
};


export default forwardRef(Button);
