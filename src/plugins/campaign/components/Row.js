import React from "react";
import styled from "styled-components";


const Row = styled.div`
    display: flex;

    >* {
        flex-shrink: 0;
    }

    margin-bottom: 10%;
    justify-content: center;
    `;
    
    const RowOuter = styled.div`
    height: 100%;
    margin: auto;
    width: 100%;
    max-width: 600px;
    &:last-child>div {margin-bottom: 0;}
`;


export default ({ children }) => (
    <RowOuter>
        <Row>
            {children}
        </Row>
    </RowOuter>
)