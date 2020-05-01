import React from "react";
import { Link } from "ractf";

import "./Leader.scss";


export default ({ link, children, sub, green, click }) => {
    return <Link to={link} onClick={click}
        className={"leader" + (green ? " leaderGreen" : "")}>
        <div className={"leaderName"}>{children}</div>
        <div className={"leaderSub"}>{sub}</div>
    </Link>;
};
