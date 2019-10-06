import styled, { css } from "styled-components";

import * as plugin_theme from "../plugin_theme";
import { theme } from "ractf";


export default styled.div`
    ${props => (props.left || props.right) && css`
        height: 4px;
        width: ${plugin_theme.link_part};
        position: absolute;
        left: calc(100% + 4px);
        top: calc(50% - 2px);
        
        ${props => props.left && css`left: auto; right: calc(100% + 4px);`}
    `}
    ${props => (props.up || props.down) && css`
        width: 4px;
        height: ${plugin_theme.link_part};
        position: absolute;
        top: calc(100% + 4px);
        left: calc(50% - 2px);
        
        ${props => props.up && css`top: auto; bottom: calc(100% + 4px);`}
    `}
    background-color: ${props => props.done ? "#6b6" : props.unlocked ? theme.bg_l3 : theme.bg_l1};
`;