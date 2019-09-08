import React from 'react';

import { addDecorator, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

import { GlobalStyle } from "../src/containers/controllers/App";
import MockRoute from "./MockRoute";

import styled from 'styled-components';
const Centre = styled.div`
    display: flex;
    align-items: center;
    height: 100vh;
    width: 100vw;
    justify-content: center;

    &>div {
        flex-grow: 1;
    }
`;

addDecorator(withKnobs);
addDecorator(s => <><GlobalStyle /><MockRoute><Centre><div>{s()}</div></Centre></MockRoute></>);

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);