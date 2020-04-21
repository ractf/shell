import React from "react";

import "./ProgressBar.scss";


export default ({ progress, thick, width }) => {
    return <div className={"progressBar" + (progress === 1 ? " pbDone" : "") + (thick ? " thick" : "")}
        style={width ? { width: width } : {}}>
        <div className={"pbInner"} style={{ width: progress * 100 + "%" }} />
    </div>;
};
