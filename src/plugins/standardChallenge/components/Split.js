import React, { useState } from "react";

import "./Split.scss";


export default ({ children, ...props }) => {
    if (!(children instanceof Array)) children = [children];
    const [showLeft, setShowLeft] = useState(true);
    const [showRight, setShowRight] = useState(true);
    let left = children[0];
    let right = children[1];
    if (right) {
        right = React.cloneElement(right, {
            showLeft: showLeft,
            setLeft: setShowLeft,
            ...props
        });
    }
    if (left) {
        left = React.cloneElement(left, {
            showRight: showRight,
            setRight: setShowRight,
            ...props
        });
    }
    return <div className={(right ? "challengeSplit" : "")}>
        {showLeft && left && <div className={"challengeLeft"}><div>{left}</div></div>}
        {showRight && right && <div className={"challengeRight"}><div>{right}</div></div>}
    </div>;
};
