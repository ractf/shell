import React from "react";

import "./Children.scss"


export default ({open, openHeight, children}) => {
    let cn = "jpChildren";
    if (open) cn += " open";
    return <div className={cn} style={{maxHeight: openHeight}}>{children}</div>
};
