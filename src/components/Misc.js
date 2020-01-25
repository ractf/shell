import React from "react";

import "./Misc.scss";


export const HR = ({ children }) => (
    <div className={"hr"}>{ children }</div>
);
export const SectionTitle = ({ children }) => (
    <div className={"sectionTitle"}>{ children }</div>
);
export const SectionTitle2 = ({ children }) => (
    <div className={"sectionTitle2"}>{ children }</div>
);
export const SectionHeading = ({ children }) => (
    <div className={"sectionHeading"}>{ children }</div>
);
export const SectionH2 = ({ children }) => (
    <div className={"sectionH2"}>{ children }</div>
);
export const SectionSub = ({ children }) => (
    <div className={"sectionSub"}>{ children }</div>
);
export const CTFContainer = ({ children }) => (
    <div className={"ctfContainer"}>{ children }</div>
);
export const TextBlock = ({ children, ...props }) => (
    <div {...props} className={"textBlock " + props.className}>{ children }</div>
);
export const SubtleText = ({ children }) => (
    <div className={"subtleText"}>{ children }</div>
);
export const SectionBlurb = ({ children }) => (
    <div className={"sectionBlurb"}>{ children }</div>
);
export const Code = ({ children }) => (
    <span className={"inlineCode"}>{ children }</span>
)
