import Loadable from "react-loadable";

import { registerPlugin } from "ractf";


export default () => {
    const chal = Loadable({
        loader: () => import("./components/ClickableMap"),
        loading: () => "Loading",
    });

    registerPlugin("challengeMetadata", "mapData", {
        fields: [
            { label: "Map settings:", type: "label" },
            { name: "minimum_zoom_level", label: "Min zoom level", type: "number" },
            { type: "hr" },
        ],
        check: (challenge) => challenge.challenge_type === "map",
    });

    registerPlugin("challengeType", "map", { rightOf: "default", component: chal });
    registerPlugin("challengeEditor", "map", { uses: "default" });
};
