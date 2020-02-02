import { registerPlugin, asyncComponent } from "ractf";


export default () => {
    const chal = asyncComponent(() => import("./components/Challenge"));

    registerPlugin("challengeType", "__default", { component: chal });
    registerPlugin("challengeType", "code", { component: chal });
}
