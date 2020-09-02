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

import { forwardRef, memo, createElement } from "react";

export { default as useReactRouter } from "./useReactRouter";
export { default as useWindowSize } from "./useWindowSize";
export { default as formatBytes } from "./formatBytes";
export { default as useInterval } from "./useInterval";
export { default as useConfig } from "./useConfig";
export { default as getUUID } from "./getUUID";

export const TYPES = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark"];

export const makeClass = (...classes) => (
    classes.filter(x => !!x).join(" ")
);

export const getHeight = (...children) => {
    let height = 0;
    children.forEach(child => {
        const styles = window.getComputedStyle(child);
        height += child.offsetHeight;
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

export const propsToTypeClass = (props, styles, fallback) => {
    const className = [];

    let willFallback = true;
    for (const i of Object.keys(props)) {
        if (props[i] && styles[i]) {
            className.push(styles[i]);
            if (TYPES.indexOf(i) !== -1)
                willFallback = false;
        }
    }
    if (willFallback && fallback) {
        className.push(styles[fallback]);
    }
    return makeClass(...className);
};

export const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const NUMBER_RE = /^-?(\d+)?\.?(\d+)?$/;
export const EMAIL_RE = /^\S+@\S+\.\S+$/;
