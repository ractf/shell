// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import { registerPlugin, registerReducer, dynamicLoad } from "ractf";

import codeRunReducer from "./reducers/codeRunReducer";


export default () => {
    const chal = dynamicLoad(() => import(/* webpackChunkName: "ide" */ "./components/IDE"));

    registerReducer("codeRun", codeRunReducer);

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

    registerPlugin("challengeType", "code", { rightOf: "default", component: chal });
    registerPlugin("challengeEditor", "code", { uses: "default" });
};
