import React from "react";

//import { FaLink } from "react-icons/fa";
//import { apiContext } from "ractf";

import "./Page.scss";


/*
const LinkIcon = ({ url }) => {
    if (!url) return null;
    return <a href={url}>
        <FaLink className={"headLinkIcon"} />
    </a>;
};


const LinkDropdown = ({ name, children }) => {
    return <div className={"headLink"} style={{ position: "relative" }}>{name}
        <ul className={"headDropdownBody"}>
            {children}
        </ul>
    </div>
};
*/


export default ({ children, vCentre, selfContained }) => {
    return (<>
        {selfContained ? children :
            <div className={"pageContent" + (vCentre ? " vCentre" : "")}>
                {children}
            </div>
        }
    </>);
};
