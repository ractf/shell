import styled, { css } from "styled-components";


export default styled.div`
    text-align: left;

    max-height: ${props => props.openHeight};
    transition: max-height 200ms ease;
    overflow-y: hidden;

    ${props => !props.open && css`
        max-height: 0;
    `}
`;
