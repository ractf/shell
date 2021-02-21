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

import { store } from "store";
import * as actions from "actions";


export { default as useConfig } from "./useConfig";
export { default as Challenge } from "./challenge";
export { default as Category } from "./category";
export * from "./hooks";

import(/* webpackChunkName: "zxcvbn" */ "zxcvbn").then(zx => window.__zxcvbn = zx.default);
export const zxcvbn = () => (window.__zxcvbn || null);

export const getLocalConfig = (key, fallback) => {
    const preferenceValue = (store.getState().preferences || {})[key];
    return preferenceValue !== undefined ? preferenceValue : fallback;
};
export const setLocalConfig = (key, value) => {
    store.dispatch(actions.setPreference(key, value));
};
