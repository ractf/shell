import React from "react";

import "./ProgressBar.scss";


export default ({ progress }) => {
    return <div className={"progressBar" + (progress === 1 ? " pbDone" : "")}>
        <div className={"pbInner"} style={{ width: progress * 100 + "%" }} />
    </div>;
};
