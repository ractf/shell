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

import {
    _plugins as plugins,
    _mounts as mounts,
    registeredPreferences
} from "@ractf/plugins";

import { store, injectReducer } from "store";


export const registerPlugin = (type, key, handler) => {
    if (!plugins[type]) plugins[type] = {};
    plugins[type][key] = handler;
};
export const registerReducer = (name, reducer) => {
    injectReducer(store, name, reducer);
};
export const registerMount = (mountPoint, key, component, options = { isComponent: true }) => {
    if (!mounts[mountPoint]) mounts[mountPoint] = {};
    mounts[mountPoint][key] = { component, isComponent: options.isComponent };
};
export const registerPreferences = (preferences) => {
    registeredPreferences.push(...preferences);
};
