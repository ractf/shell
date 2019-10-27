import React from "react";

import { registerPlugin } from "ractf";

import Challenge from "./components/Challenge";


const makeChallenge = (challenge, hider, isEditor, saveEdit) => {
    return <Challenge challenge={challenge} isEditor={isEditor} onHide={hider} saveEdit={saveEdit} />;
}


export default () => {
    registerPlugin("challengeType", "__default", {generator: makeChallenge});
}
