import { forwardRef, createElement } from "react";
export { default as useReactRouter } from "./useReactRouter";
export { default as useWindowSize } from "./useWindowSize";

export const TYPES = ["primary", "secondary", "success", "info", "warning", "danger", "light"];

export const makeClass = (...classes) => (
    classes.filter(x => !!x).join(" ")
);

export const getHeight = (...children) => {
    let height = 0;
    children.forEach(child => {
        let styles = window.getComputedStyle(child);
        height += child.offsetHeight;
        height += parseFloat(styles['marginTop']);
        height += parseFloat(styles['marginBottom']);
    });
    return height;
};

export const basicComponent = (localClass, element) => forwardRef(
    ({ className, ...props }, ref) => createElement(element || "div", {
        className: makeClass(localClass, className),
        ...props, ref: ref
    })
);

export const propsToTypeClass = (props, styles, fallback) => {
    let className = "";
    for (const i of TYPES) {
        if (props[i]) {
            if (className.length) className += " ";
            className += styles[i];
        };
    }
    if (!className.length && fallback) className += styles[fallback];
    return className;
};
