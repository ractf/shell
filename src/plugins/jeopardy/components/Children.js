import React, { forwardRef } from "react";

import "./Children.scss"


export default forwardRef(({open, openHeight, children}, ref) => {
    let cn = "jpChildren";
    if (open) cn += " open";
    return <div ref={ref} className={cn} style={{maxHeight: openHeight}}>{children}</div>
});
