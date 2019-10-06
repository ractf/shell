import styled from "styled-components";

import { theme } from "ractf";


export default styled.div`
    border: 1px solid ${theme.bg_l1};
    background-color: ${theme.bg_d0};
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    text-decoration: none;
    margin-top: 16px;
    color: ${theme.fg};
    display: flex;
    align-items: center;
    max-width: 400px;
    margin-right: 16px;

    &:hover {
        color: ${theme.fg};
        text-decoration: none;
    }

    &>svg {
        flex-shrink: 0;
        font-size: 1.5em;
        opacity: .6;
        margin-right: 16px;
    }
    &>div {
        flex-grow: 1;
    }

    cursor: ${props => props.onClick ? "pointer": "default"};
`;


export const LinkMeta = styled.div`
    opacity: .8;
    font-size: .8em;
    margin-top: 4px;
`;


export const LinkGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
`;
