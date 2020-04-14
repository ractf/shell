import React from "react";

import "./Page.scss";


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
