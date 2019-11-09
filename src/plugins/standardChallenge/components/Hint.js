import React from "react";
import { FaInfoCircle } from "react-icons/fa";

import "./Challenge.scss";


export default ({ name, points, onClick }) => {
    return <div className={"challengeLink clickable"}>
        <FaInfoCircle />
        <div>
            {name}
            <div className={"challengeLinkMeta"}>-{points} points.</div>
        </div>
    </div>;
};
