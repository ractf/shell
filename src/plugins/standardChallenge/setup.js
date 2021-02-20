// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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

import { dynamicLoad } from "@ractf/util";
import { registerPlugin } from "@ractf/plugins";


export default () => {
    const chal = dynamicLoad(() => import(/* webpackChunkName: "challenge" */ "./components/Challenge"));
    const editor = dynamicLoad(() => import(/* webpackChunkName: "challenge-editor" */ "./components/Editor"));

    registerPlugin("challengeMetadata", "standardChallenge", {
        fields: [
            {
                label: "Attempt Limit", type: "group", children: [
                    { name: "attempt_limit", label: "Challenge attempt limit", type: "number" },
                ]
            },
            {
                label: "Flag RegExps (Both must be set)", type: "group", children: [
                    { name: "flag_regex", label: "Flag RegExp", type: "text" },
                    { name: "flag_partial_regex", label: "Flag partial RegExp", type: "text" },
                ]
            },
        ]
    });

    registerPlugin("challengeType", "default", { component: chal });
    registerPlugin("challengeType", "freeform", { component: chal });
    registerPlugin("challengeType", "longText", { component: chal });

    registerPlugin("challengeEditor", "default", { component: editor });
    registerPlugin("challengeEditor", "freeform", { uses: "default" });
    registerPlugin("challengeEditor", "longText", { uses: "default" });
};
