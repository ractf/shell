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


export default ({ children, vCentre, selfContained, noPad, maxWidth }) => {
    const style = noPad ? {padding: 0} : {};
    const innerStyle = maxWidth ? {maxWidth: maxWidth} : {};
    
    return (<div className="sbtBody" style={style}>
        {selfContained ? children :
            <div className={"pageContent" + (vCentre ? " vCentre" : "")} style={innerStyle}>
                {children}
            </div>
        }
    </div>);
};
