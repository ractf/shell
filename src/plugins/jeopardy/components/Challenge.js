import React from "react";
import "./Challenge.scss";


export default ({ name, done, click, points }) => {
    let cn = "jcTheme";
    if (done) cn += " done";

    return <div className={cn} onMouseDown={(e => (e.target.click && e.target.click()))} onClick={done ? click : null}>
        <span>{name}</span>
    </div>;
};
