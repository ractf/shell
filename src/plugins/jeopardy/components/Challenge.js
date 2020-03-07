import React from "react";
import "./Challenge.scss";

import { fastClick } from "ractf";


export default ({ name, done, click, points }) => {
    let cn = "jcTheme";
    if (done) cn += " done";

    return <div className={cn} {...fastClick} onClick={done ? click : null}>
        <span>{name}</span>
    </div>;
};
