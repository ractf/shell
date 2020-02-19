import React, { useState, useRef, useContext } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdMenu } from "react-icons/md";

import { apiContext, apiEndpoints, Link } from "ractf";
import Wordmark from "./Wordmark";

import "./SidebarTabs.scss";


export const SBMenu = ({ name, children, initial }) => {
    const [height, setHeight] = useState(initial ? 'auto' : 0);
    const childs = useRef();

    const toggle = () => {
        if (height !== 0) setHeight(0);
        else {
            setHeight(
                Array.prototype.reduce.call(childs.current.childNodes, (p, c) => (p + (c.offsetHeight || 0)), 0)
            );
        }
    };

    return <>
        <div onClick={toggle} className={"sbtItem" + (height === 0 ? "" : " sbtActive")}>
            {children && children.length && <MdKeyboardArrowRight />}{name}
        </div>
        <div className={"sbtChildren"} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>;
};


export const SidebarTabs = ({ children, noHead, feet, onChangeTab }) => {
    const [active, setActive] = useState(0);
    const [sbOpen, setSbOpen] = useState(false);

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div className={"sbtSidebar"}>
            <div onClick={() => setSbOpen(!sbOpen)} className={"sbtHandle"}><MdKeyboardArrowLeft /></div>
            {!noHead && <Wordmark className={"sbtBrand"} />}
            {children.map((i, n) =>
                <div key={i.props.title} className={"sbtItem" + (n === active ? " sbtActive" : "")}
                    onClick={() => { setActive(n); setSbOpen(false); onChangeTab && onChangeTab(n); }}>
                    {i.props.title}
                </div>
            )}
            <div style={{ flexGrow: 1 }} />
            {feet && feet.map((i, n) =>
                <div key={i.props.title} style={{ textAlign: "center" }}
                className={"sbtItem" + (children.length + n === active ? " sbtActive" : "")}
                    onClick={() => {
                        setActive(children.length + n);
                        setSbOpen(false);
                        if (onChangeTab) onChangeTab(children.length + n);
                    }}>
                    {i.props.title}
                </div>
            )}
        </div>
        <div className={"sbtBody"}>
            {children.map((i, n) => <div key={i.props.title} style={{ display: n === active ? "block" : "none" }}>
                {i}
            </div>)}
            {feet && feet.map((i, n) => (
                <div key={i.props.title} style={{ display: children.length + n === active ? "block" : "none" }}>
                    {i}
                </div>
            ))}
        </div>
    </div>;
};


export const SiteNav = ({ children }) => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);

    const [sbOpen, setSbOpen] = useState(false);

    const close = () => setSbOpen(false);

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div onMouseDown={() => setSbOpen(false)} className={"sbtBurgerUnderlay"} />
        <div onMouseDown={() => setSbOpen(!sbOpen)} className={"sbtBurger"}><MdMenu /></div>
        <div className={"sbtSidebar"}>
            <hr />
            <SBMenu key={"ractf"} name={"RACTF"} initial>
                <Link onClick={close} to={"/home"} className={"sbtSubitem"}>Home</Link>
                <Link onClick={close} to={"/users"} className={"sbtSubitem"}>Users</Link>
                <Link onClick={close} to={"/teams"} className={"sbtSubitem"}>Teams</Link>
                <Link onClick={close} to={"/leaderboard"} className={"sbtSubitem"}>Leaderboard</Link>
            </SBMenu>
            <hr />
            {api.user ? <>
                <SBMenu key={"challenges"} name={"Challenges"} initial>
                    {api.challenges.map(i =>
                        <Link onClick={close} to={"/campaign/" + i.id} key={i.id} className={"sbtSubitem"}>{i.name}</Link>
                    )}
                    {api.user.is_staff &&
                        <Link onClick={close} to={"/campaign/new"} key={"newcat"} className={"sbtSubitem"}>+ Add new category</Link>
                    }
                </SBMenu>
                <hr />
                <SBMenu key={"user"} name={api.user.username}>
                    <Link onClick={close} to={"/profile/me"} className={"sbtSubitem"}>Profile</Link>
                    <Link onClick={close} to={"/team/me"} className={"sbtSubitem"}>Team</Link>
                    <Link onClick={close} to={"/settings"} className={"sbtSubitem"}>Settings</Link>
                    <Link onClick={close} to={"/logout"} className={"sbtSubitem"}>Logout</Link>
                </SBMenu>
                <hr />
            </> : (endpoints.configGet("login", true) || endpoints.configGet("registration", true)) ? <>
                <SBMenu key={"login"} name={"Login"} initial>
                    {endpoints.configGet("login", true) &&
                        <Link onClick={close} key={"login"} to={"/login"} className={"sbtSubitem"}>Login</Link>}
                    {endpoints.configGet("registration", true) &&
                    <Link onClick={close} key={"register"} to={"/register"} className={"sbtSubitem"}>Register</Link>}
                </SBMenu>
                <hr />
            </> : null}
            {api.user && api.user.is_staff && <>
                <SBMenu key={"admin"} name={"Admin"}>
                    <Link onClick={close} to={"/admin/ctf"} className={"sbtSubitem"}>Event</Link>
                    <Link onClick={close} to={"/admin/config"} className={"sbtSubitem"}>Configuration</Link>
                    <Link onClick={close} to={"/admin/service"} className={"sbtSubitem"}>Service Status</Link>
                    <Link onClick={close} to={"/admin/announcements"} className={"sbtSubitem"}>Announcements</Link>
                    <Link onClick={close} to={"/admin/members"} className={"sbtSubitem"}>Members</Link>
                    <Link onClick={close} to={"/admin/teams"} className={"sbtSubitem"}>Teams</Link>
                </SBMenu>
                <hr />
            </>}
        </div>

        <div className={"sbtBody"}>
            {children}
        </div>
    </div>;
};


export const SBTSection = ({ title, children, subTitle, noHead }) => {
    return <>
        {!noHead && <div className={"abTitle"}>{title}{subTitle && <div>
            {subTitle}
        </div>}</div>}
        {children}
    </>;
};


export const Section = ({ title, children, light }) => <>
    <div className={"abSection" + (light ? " absLight" : "")}>
        <div className={"absTitle"}>{title}</div>
        <div className={"absBody"}>
            {children}
        </div>
    </div>
</>;
