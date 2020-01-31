import { registerPlugin } from "ractf";

import Challenge from "./components/Challenge";


export default () => {
    registerPlugin("challengeType", "__default", { component: Challenge });
    registerPlugin("challengeType", "code", { component: Challenge });
}
