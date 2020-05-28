import React, { useState } from "react";

import "./Split.scss";
import { Row, Column } from "@ractf/ui-kit";


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

    const double = (left && showLeft && right && showRight);
    const wasDouble = (left && right);

    return <Row className={wasDouble && "challengeSplit"}>
        {showLeft && left && <Column lgWidth={double ? 6 : 12} className={"challengeLeft"}>
            {left}
        </Column>}
        {showRight && right && <Column lgWidth={double ? 6 : 12} className={"challengeRight"}>
            {right}
        </Column>}
    </Row>;
};
