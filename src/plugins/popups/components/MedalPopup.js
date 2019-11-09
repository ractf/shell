import React from "react";
import styled from "styled-components";

import { plugins } from "ractf";


const OuterWrap = styled.div`
    position: relative;
    overflow: hidden;
`;
const Wrap = styled.div`
    padding: 24px 32px;
    font-size: .9em;
    &>div:first-child {
        font-size: 1.3em;
        margin-bottom: 12px;
    }
    z-index: 2;
    position: relative;
`;

const Icon = styled.div`
    position: absolute;
    right: -16px;
    bottom: -16px;
    height: 96px;
    width: 96px;
    opacity: .6;
    &>svg {
        height: 96px;
        width: 96px;
    }
`;


export default ({ popup }) => {
    const medal = plugins.medal[popup.medal];
    if (!medal) return <Wrap>Unknown medal type '{popup.medal}'</Wrap>

    return <OuterWrap>
        <Wrap>
            <div>{ medal.name }</div>
            <div>{ medal.description }</div>
        </Wrap>
        <Icon>{ medal.icon }</Icon>
    </OuterWrap>
};
