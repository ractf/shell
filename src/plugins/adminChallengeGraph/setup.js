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

import { FiShare2 } from "react-icons/fi";

import { dynamicLoad } from "@ractf/shell-util";
import { registerPlugin } from "@ractf/plugins";


const ChallengeGraph = dynamicLoad(() => (
    import(/* webpackChunkName: "challenge-graph" */ "./components/ChallengeGraph")
));

export default () => {
    registerPlugin("adminPage", "graph", {
        component: ChallengeGraph,
        sidebar: "Challenge Graph",
        Icon: FiShare2,
    });
};
