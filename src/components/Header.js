import React from "react";

import { Link } from "ractf";

import Wordmark from "./Wordmark";
//import Button from "./Button";

import "./Header.scss";


export default React.memo(() => <>
    <div id={"headerPad"} />
    <header>
        <Link to="/">
            <Wordmark />
        </Link>

        {/*<Button small>Install App</Button>*/}
    </header>
</>);
