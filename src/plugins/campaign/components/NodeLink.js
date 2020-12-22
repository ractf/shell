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

import React from "react";

//import "./NodeLink.scss";


const NodeLink = (props) => {
    let className = "nodeLink";
    if (props.left) className += " left";
    if (props.right) className += " right";
    if (props.up) className += " up";
    if (props.down) className += " down";
    if (props.isEdit) className += " isEdit";
    if (props.unlocked) className += " unlocked";
    if (props.show) className += " show";
    if (props.done) className += " done";

    return <div onClick={props.onClick} onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart} className={className} />;
};
export default NodeLink;
