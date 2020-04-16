import React, { useState } from "react";

import "./Split.scss";


export default ({ children }) => {
    if (!(children instanceof Array)) children = [children];
    const [showLeft, setShowLeft] = useState(true);
    let left = children[0];
    let right = children[1];
    if (right) {
        right = React.cloneElement(right, {
            showLeft: showLeft,
            setLeft: setShowLeft
        });
    }
    return <div className={(right ? "challengeSplit" : "")}>
        {showLeft && <div className={"challengeLeft"}><div>{left}</div></div>}
        {right && <div className={"challengeRight"}><div>{right}</div></div>}
    </div>;
};
