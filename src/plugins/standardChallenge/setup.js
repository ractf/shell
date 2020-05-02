import Loadable from "react-loadable";

import { registerPlugin } from "ractf";


export default () => {
    const chal = Loadable({
        loader: () => import("./components/Challenge"),
        loading: () => "Loading",
    });
    const editor = Loadable({
        loader: () => import("./components/Editor"),
        loading: () => "Loading",
    });

    registerPlugin("challengeMetadata", "standardChallenge", {
        fields: [
            { name: "attempt_limit", label: "Challenge attempt limit", type: "number" },
            { type: "hr" },
            { label: "Flag RexExps (Both must be set).", type: "label" },
            { name: "flag_regex", label: "Flag RegExp", type: "text" },
            { name: "flag_partial_regex", label: "Flag partial RegExp", type: "text" },
            { type: "hr" },
        ]
    });

    registerPlugin("challengeType", "default", { component: chal });
    registerPlugin("challengeType", "freeform", { component: chal });
    registerPlugin("challengeType", "longText", { component: chal });

    registerPlugin("challengeEditor", "default", { component: editor });
    registerPlugin("challengeEditor", "freeform", { uses: "default" });
    registerPlugin("challengeEditor", "longText", { uses: "default" });
};
