import Loadable from "react-loadable";

import { registerPlugin } from "ractf";


export default () => {
    const chal = Loadable({
        loader: () => import("./components/Challenge"),
        loading: () => "Loading",
    });

    registerPlugin("challengeMetadata", "codeIngest", {
        fields: [
            {label: "Code ingest settings:", type: "label"},
            {name: "code_language", label: "Code language", type: "select", options: [
                {key: "python", value: "Python"},
                {key: "cpp", value: "C++"},
                {key: "gcc", value: "C"},
                {key: "perl", value: "Perl"},
                {key: "ruby", value: "Ruby"},
                {key: "java", value: "Java"},
                {key: "node", value: "Node.JS"},
                {key: "nasm", value: "Assembly (NASM)"},
            ]},
            {name: "code_default", label: "Default code", type: "code"},
            {type: "hr"},
        ],
        check: (challenge) => challenge.challenge_type === "code",
    });

    registerPlugin("challengeType", "default", { component: chal });
    registerPlugin("challengeType", "freeform", { component: chal });
    registerPlugin("challengeType", "longText", { component: chal });
    registerPlugin("challengeType", "code", { component: chal });
};
