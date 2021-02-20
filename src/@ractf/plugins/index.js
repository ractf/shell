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

export { default as mountPoint } from "./mountPoint";
export { default as FlagForm } from "./components/FlagForm";
export * from "./registration";
export * from "./classes";
export * from "./helpers";


const mounts = {};
const plugins = {
    categoryType: {},
    challengeMod: {},
    challengeType: {},
    challengeEditor: {},
    challengeMetadata: {},
    categoryMetadata: {},
    page: {},
    popup: {},
    medals: {},
    config: {},
    adminPage: {},
    loginProvider: {},
    registrationProvider: {},
    postLogin: {},
    errorHandler: {},
    categoryMatcher: {},
    challengeMatcher: {},
    flagType: {},
    topLevelPage: {},
};
export const registeredPreferences = [];
export const _plugins = plugins;
export const _mounts = mounts;

// Export the plugins object for debugging purposes.
window.__ractf_plugins = plugins;

