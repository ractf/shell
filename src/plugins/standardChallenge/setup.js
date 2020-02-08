import Loadable from "react-loadable";

import { registerPlugin } from "ractf";


export default () => {
    const chal = Loadable({
        loader: () => import("./components/Challenge"),
        loading: () => "Loading",
    });

    registerPlugin("challengeType", "__default", { component: chal });
    registerPlugin("challengeType", "code", { component: chal });
};
