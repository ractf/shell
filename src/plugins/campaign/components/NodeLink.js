import styled, { css } from "styled-components";

import * as plugin_theme from "../plugin_theme";
import { theme } from "ractf";


export default styled.div`
    position: relative;
    &::before {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 64px;
        height: 64px;
        height: ;
        content: "";
    }

    ${props => (props.left || props.right) && css`
        height: 4px;
        width: ${plugin_theme.link_part};
        position: absolute;
        left: calc(100% + 4px);
        @media (max-width: 600px)   {
            left: calc(100% + 2px);
        }
        top: calc(50% - 2px);

        &::before {
            width: 100%;
        }
        
        ${props => props.left && css`
            left: auto; right: calc(100% + 4px);
            @media (max-width: 600px)   {
                left: auto; right: calc(100% + 2px);
            }
        `}
    `}
    ${props => (props.up || props.down) && css`
        width: 4px;
        height: ${plugin_theme.link_part};
        position: absolute;
        top: calc(100% + 4px);
        @media (max-width: 600px) {
            top: calc(100% + 2px);
        }
        left: calc(50% - 2px);

        &::before {
            height: 100%;
        }
        
        ${props => props.up && css`
            top: auto; bottom: calc(100% + 4px);
            @media (max-width: 600px) {
                top: auto; bottom: calc(100% + 2px);
            }
        `}
    `}
    background-color: ${props => props.done ? "#6b6" : props.unlocked ? theme.bg_l3 : theme.bg_l1};

    ${props => !props.show && css`
        opacity: 0;
    `}

    ${props => props.isEdit && css`
        &:hover {
            opacity: 1;
        }
    `}
`;