import React, { Component } from 'react';
import { Normalize } from 'styled-normalize';
import styled, { createGlobalStyle } from 'styled-components';
import Particles from 'react-particles-js';
import { BrowserRouter } from "react-router-dom";

import particles_js_config from "../../partices_js_config.js";
import Routes from "./Routes";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API, APIContext } from "./API";


const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body, html {
        font-family: 'Roboto Mono', monospace;
        background-color: #222034;
        color: #fff;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    #root {
        height: 100%;
        display: flex;
        flex-direction: column;
        z-index: 1;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        align-items: center;
    }

    a {
        text-decoration: none;
        color: #337ab7;
        margin: 0;
        padding: 0;

        &:hover {
            color: #23527c;
            text-decoration: underline;
        }
    }
`;

const StyledParticles = styled(Particles)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
`;
const Container = styled.div`
    max-width: 1400px;
    width: 100%;
    text-align: center;
    flex-grow: 1;
    position: relative;
`;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            particles_js: true
        }
    }

    render() {
        return (
            <BrowserRouter>
                <API><APIContext.Consumer>{api => <>
                    {/* TODO: Use api.ready */}

                    {this.state.particles_js ? <StyledParticles params={particles_js_config} /> : null}
                    <Normalize />
                    <GlobalStyle />
                    <Header />
                    <Container>
                        <Routes />
                    </Container>
                    <Footer />
                </>}</APIContext.Consumer></API>
            </BrowserRouter>
        );
    }
}

export default App;
