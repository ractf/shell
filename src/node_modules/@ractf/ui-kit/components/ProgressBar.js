import React from "react";

import "./ProgressBar.scss";


export default ({ progress, thick, width }) => {
    let className = "progressBar";
    if (progress === 1) className += " pbDone";
    if (thick) className += " thick";
    if (progress > 1) {
        className += " pbOver";
        progress = 1;
    }
    
    return <div className={className}
        style={width ? { width: width } : {}}>
        <div className={"pbInner"} style={{ width: progress * 100 + "%" }} />
    </div>;
};
