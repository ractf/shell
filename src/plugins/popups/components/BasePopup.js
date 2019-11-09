import React from "react";
import styled from "styled-components";


const Wrap = styled.div`
    padding: 24px 32px;
    font-size: .9em;
    &>div:first-child {
        font-size: 1.3em;
        margin-bottom: 12px;
    }
`;


export default ({ popup }) => <Wrap>
    <div>{ popup.title }</div>
    <div>{ popup.body }</div>
</Wrap>;
