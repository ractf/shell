import React from "react";

import "./Row.scss";


export default ({ children }) => (
    <div className={"campaignRowOuter"}>
        <div className={"campaignRow"}>
            {children}
        </div>
    </div>
)