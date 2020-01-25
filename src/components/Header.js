import React from "react";
import { Link } from "react-router-dom";

import Wordmark from "./Wordmark";

import "./Header.scss";


export default () => (
    <header>
        <Link to="/">
            <Wordmark height={38} />
        </Link>
    </header>
);
