import React from "react";

import "./Misc.scss";


export const HR = ({ children }) => (
    <div className={"hr"}>{children}</div>
);
export const SectionTitle = ({ children }) => (
    <div className={"sectionTitle"}>{children}</div>
);
export const SectionTitle2 = ({ children }) => (
    <div className={"sectionTitle2"}>{children}</div>
);
export const SectionHeading = ({ children }) => (
    <div className={"sectionHeading"}>{children}</div>
);
export const TextBlock = ({ children, ...props }) => (
    <div {...props} className={"textBlock " + props.className}>{children}</div>
);
export const SubtleText = ({ children }) => (
    <div className={"subtleText"}>{children}</div>
);
export const FlexRow = ({ children, left, right, className }) => (
    <div className={"flexRow" + (right ? " frRight" : "")
        + (left ? " frLeft" : "") + (className ? " " + className : "")}
    >
        {children}
    </div>
);
