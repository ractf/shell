import React from "react";
import { FaInfoCircle } from "react-icons/fa";

import ChallengeLink, { LinkMeta } from "./ChallengeLinks";


export default ({ name, points, onClick }) => {
    return <ChallengeLink onClick={onClick}>
        <FaInfoCircle />
        <div>
            {name}
            <LinkMeta>-{points} points.</LinkMeta>
        </div>
    </ChallengeLink>;
};
