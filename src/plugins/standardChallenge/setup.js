import React from "react";

import { registerPlugin } from "ractf";

import Challenge from "./components/Challenge";


const makeChallenge = (challenge, hider) => {
    return <Challenge challenge={challenge} onHide={hider} />;
}


export default () => {
    registerPlugin("challengeType", "__default", {generator: makeChallenge});
}
