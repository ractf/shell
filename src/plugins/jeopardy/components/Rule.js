import React from "react";

import "./Rule.scss";


export default ({ open, children }) => (
    <div className={"jpRule" + (open ? " open" : "")}>{children}</div>
)
