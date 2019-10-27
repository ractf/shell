import styled from "styled-components";

import * as plugin_theme from "../plugin_theme";


export default styled.div`
    width: calc(${plugin_theme.node_size} + 8px);
    padding-bottom: calc(${plugin_theme.node_size} + 8px);
    margin: 0 ${plugin_theme.node_margin};
    height: 0;

    @media (max-width: 600px) {
        width: calc(${plugin_theme.node_size} + 4px);
        padding-bottom: calc(${plugin_theme.node_size} + 4px);
    }

    &:first-child {
        margin-left: 0;
    }
    &:last-child {
        margin-right: 0;
    }
`;