import React from "react";
import { Link } from "react-router-dom";
import styled, { css } from 'styled-components';
import { transparentize } from "polished";

import theme from "theme";


const Foot = styled.footer`
    width: 100%;
    background-color: ${transparentize(.27, theme.bg_d1)};
    flex-shrink: 0;

    padding: 10px 20px;
    padding-top: 8px;
    color: ${theme.fg};
    font-size: .8em;

    display: flex;
    flex-wrap: wrap;
`;

const ColStyle = styled.div`
    flex-shrink: 0;
    flex-grow: 1;
    min-width: 150px;

    ${props => props.right && css`
        text-align: right;
    `}

    >* {
        margin: 5px 10px;
    }

    >div.head {
        font-weight: 500px;
    }
`;

const FootCol = (props) => (
    <ColStyle right={props.right}>
        {props.title
            ? <div className={"head"}>{props.title}</div>
            : null}
        {props.children}
    </ColStyle>
);

const FootLink = (props) => <p><Link to={props.to}>{props.children}</Link></p>;


export default () => {
    return <Foot>
        <FootCol title={"RACTF"}>
            <FootLink to={"/about"}>About</FootLink>
            <FootLink to={"/conduct"}>Code of Conduct</FootLink>
            <FootLink to={"/privacy"}>Privacy Policy</FootLink>
        </FootCol>
        <FootCol title={"Social"}>
            <p><a href={"https://discord.gg/FfW2xXR"}>Discord</a></p>
        </FootCol>
        <FootCol right>
            <p>&copy; 2019 RACTF Team</p>
            <p>Built by RACTF, for RACTF</p>
        </FootCol>
    </Foot>
};
