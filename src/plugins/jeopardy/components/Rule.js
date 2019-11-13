import React from "react";

import "./Rule.scss";


export default ({ open, children, onClick }) => (
    <div onClick={onClick} className={"jpRule" + (open ? " open" : "")}>{children}</div>
)
