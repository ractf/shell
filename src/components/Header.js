import React from "react";
import { Link } from "react-router-dom";

import logo from "../static/wordmark_35px.png";

import "./Header.scss";


export default () => (
    <header>
        <Link to="/"><img alt={""} src={logo} /></Link>
    </header>
);
