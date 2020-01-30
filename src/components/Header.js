import React from "react";
import { Link } from "react-router-dom";

import Wordmark from "./Wordmark";
import Button from "./Button";

import "./Header.scss";


export default () => <>
    <div id={"headerPad"} />
    <header>
        <Link to="/">
            <Wordmark />
        </Link>

        <Button small>Install App</Button>
    </header>
</>;
