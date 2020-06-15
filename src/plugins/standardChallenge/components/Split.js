// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

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
