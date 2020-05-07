import React from "react";
import { Link } from "@ractf/ui-kit";

import "./Leader.scss";


export default ({ link, children, sub, green, x, none, click }) => {
    return <Link to={link} onClick={click}
        className={"leader" + (green ? " leaderGreen" : "") + (x ? " leaderX" : "") + (none ? " leaderNone" : "")}>
        <div className={"leaderName"}>{children}</div>
        <div className={"leaderSub"}>{sub}</div>
    </Link>;
};
