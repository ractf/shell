import styled from "styled-components";

import * as plugin_theme from "../plugin_theme";


export default styled.div`
    width: ${plugin_theme.node_size};
    height: ${plugin_theme.node_size};
    @media (max-width: 600) {
        width: ${plugin_theme.node_size_small};
        height: ${plugin_theme.node_size_small};    
    }
    margin: 0 ${plugin_theme.node_margin};
    &:first-child {
        margin-left: 0;
    }
    &:last-child {
        margin-right: 0;
    }
`;