import styled from "styled-components";

import * as plugin_theme from "../plugin_theme";


export default styled.div`
    display: flex;

    >* {
        flex-shrink: 0;
    }

    margin-bottom: ${plugin_theme.link_size};
    &:last-child {margin-bottom: 0;}
    justify-content: center;
`;
