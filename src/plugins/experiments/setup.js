// Copyright (C) 2021 Really Awesome Technology Ltd
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

import { dynamicLoad } from "@ractf/shell-util";
import { registerPlugin, registerPreferences } from "@ractf/plugins";

import EXPERIMENTS from "./experiments";


export default () => {
    const experiments = dynamicLoad(() => import(/* webpackChunkName: "experiments" */ "./AdminPage"));
    registerPreferences(Object.keys(EXPERIMENTS).map(i => ({ name: `experiment.${i}`, initial: false })));

    registerPlugin("page", "/debug/experiments", {
        title: "Experiments",
        component: experiments
    });
};
