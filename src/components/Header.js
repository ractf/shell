import React from "react";
import i18next from 'i18next';

import { Link } from "ractf";

import Wordmark from "./Wordmark";
import Button, { ButtonRow } from "./Button";

import "./Header.scss";


export default React.memo(() => <>
    <div id={"headerPad"} />
    <header>
        <Link to="/">
            <Wordmark />
        </Link>

        <ButtonRow>
            <Button click={() => i18next.changeLanguage("de")} small>i18n strings</Button>
            <Button click={() => i18next.changeLanguage("en")} small>English</Button>
        </ButtonRow>
    </header>
</>);
