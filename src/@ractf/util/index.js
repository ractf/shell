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

import { forwardRef, memo, createElement } from "react";

import { makeClass } from "./classes";


export { default as useReactRouter } from "./useReactRouter";
export { default as useWindowSize } from "./useWindowSize";
export { default as formatBytes } from "./formatBytes";
export { default as useInterval } from "./useInterval";
export { default as getUUID } from "./getUUID";
export * from "./colours";
export * from "./objects";
export * from "./classes";


export const getHeight = (...children) => {
    let height = 0;
    children.forEach(child => {
        const styles = window.getComputedStyle(child);
        height += child.getBoundingClientRect().height;
        height += parseFloat(styles["marginTop"]);
        height += parseFloat(styles["marginBottom"]);
    });
    return height;
};

export const basicComponent = (localClass, name, element) => {
    const component = ({ className, ...props }, ref) => createElement(element || "div", {
        className: makeClass(localClass, className),
        ...props, ref: ref
    });
    if (name)
        Object.defineProperty(component, "name", { value: name });
    return memo(forwardRef(component));
};

export const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const NUMBER_RE = /^-?(\d+)?\.?(\d+)?$/;
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

const _fastClick = e => {
    e.target && e.target.click && e.target.click();
    e.preventDefault();
    e.stopPropagation();
    return false;
};
export const fastClick = {
    onMouseDown: _fastClick,
    onTouchStart: _fastClick,
};
