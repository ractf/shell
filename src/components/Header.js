import React from "react";
import { Link } from "react-router-dom";
import { transparentize } from "polished";

import logo from "../static/wordmark_35px.png";

import theme from "theme";


const linkStyle = {
    fontSize: "1.4em",
    fontWeight: "500",
    color: theme.fg + " !important",
    flexBasis: "0",
    flexGrow: "1",
};

const imgStyle = {
    height: "35px"
};

const headStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: transparentize(.27, theme.bg_d1),
    padding: "16px 32px",
    position: "relative",
    zIndex: "50",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
};


export default () => (
    <header style={headStyle}>
        <Link style={linkStyle} to="/"><img alt={""} style={imgStyle} src={logo} /></Link>
    </header>
);
