import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import theme from "theme";


const HubButton = styled.button`
    padding: 2rem 16px;
    width: 300px;
    margin: 4px;
    margin-bottom: 8px;
    font-size: 1.2rem;
    border-radius: 2px;
    color: ${theme.fg};
    display: inline-block;
    background-color: rgba(24,22,36,0.7);
    border: 1px solid #181624;
    word-wrap: break-word;
    position: relative;
    cursor: pointer;

    > a {
        color: inherit;
    }
`;
const NoUnderline = styled(Link)`
    && {
        text-decoration: none;
    }
`;

export default (props) =>
    <NoUnderline to={props.to}>
        <HubButton {...props}>
            {props.children}
        </HubButton>
    </NoUnderline>;
