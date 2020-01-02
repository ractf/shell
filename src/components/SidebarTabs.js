import React, { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

import logo from "../static/wordmark.png";

import "./SidebarTabs.scss";


export const SidebarTabs = ({ children, noHead, feet, onChangeTab }) => {
    const [active, setActive] = useState(0);
    const [sbOpen, setSbOpen] = useState(false);

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div className={"sbtSidebar"}>
            <div onClick={() => setSbOpen(!sbOpen)} className={"sbtHandle"}><MdKeyboardArrowLeft/></div>
            {!noHead && <img className={"sbtBrand"} alt={""} src={logo} />}
            {children.map((i, n) =>
                <div key={i.props.title} className={"sbtItem" + (n === active ? " sbtActive" : "")}
                    onClick={() => {setActive(n); setSbOpen(false); onChangeTab && onChangeTab(n)}}>
                    {i.props.title}
                </div>
            )}
            <div style={{ flexGrow: 1 }} />
            {feet && feet.map((i, n) =>
                <div key={i.props.title} style={{ textAlign: "center" }} className={"sbtItem" + (children.length + n === active ? " sbtActive" : "")}
                    onClick={() => {setActive(children.length + n); setSbOpen(false); onChangeTab && onChangeTab(children.length + n)}}>
                    {i.props.title}
                </div>
            )}
            <div className={"sbtItem"} style={{ textAlign: "center" }}>Back Home</div>
        </div>
        <div className={"sbtBody"}>
            {children.map((i, n) => <div key={i.props.title} style={{ display: n === active ? "block" : "none" }}>
                {i}
            </div>)}
            {feet && feet.map((i, n) => <div key={i.props.title} style={{ display: children.length + n === active ? "block" : "none" }}>
                {i}
            </div>)}
        </div>
    </div>
};

export const SBTSection = ({ title, children, subTitle, noHead }) => {
    return <>
        {!noHead && <div className={"abTitle"}>{title}{subTitle && <div>
            {subTitle}
        </div>}</div>}
        {children}
    </>
};

export const Section = ({ title, children, light }) => <>
    <div className={"abSection" + (light ? " absLight" : "")}>
        <div className={"absTitle"}>{title}</div>
        <div className={"absBody"}>
            {children}
        </div>
    </div>
</>;
