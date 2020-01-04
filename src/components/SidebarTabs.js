import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdMenu } from "react-icons/md";

import { apiContext } from "ractf";

import logo from "../static/wordmark.png";

import "./SidebarTabs.scss";


export const SBMenu = ({ name, children, initial }) => {
    const [height, setHeight] = useState(initial ? 'auto' : 0);
    const childs = useRef();

    const toggle = () => {
        if (height !== 0) setHeight(0);
        else {
            console.log(childs);
            setHeight(
                Array.prototype.reduce.call(childs.current.childNodes, function (p, c) { return p + (c.offsetHeight || 0); }, 0)
            )
        }
    };

    return <>
        <div onClick={toggle} className={"sbtItem" + (height === 0 ? "" : " sbtActive")}>{children && children.length && <MdKeyboardArrowRight />}{name}</div>
        <div className={"sbtChildren"} style={{ height: height }} ref={childs}>
            {children}
        </div>
    </>
}


export const SidebarTabs = ({ children, noHead, feet, onChangeTab }) => {
    const [active, setActive] = useState(0);
    const [sbOpen, setSbOpen] = useState(false);

    /*
    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div className={"sbtSidebar"}>
            <hr />
            <SBMenu name={"Home"} />
            <hr />
            <SBMenu name={"Users"} />
            <hr />
            <SBMenu name={"Teams"} />
            <hr />
            <SBMenu name={"Challenges"}>
                <Link to={"/"} className={"sbtSubitem"}>hi</Link>
                <Link to={"/"} className={"sbtSubitem"}>help</Link>
                <Link to={"/"} className={"sbtSubitem"}>me</Link>
                <Link to={"/"} className={"sbtSubitem"}>pls</Link>
            </SBMenu>
            <hr />
        </div>
        <div className={"sbtBody"}>
            {children.map((i, n) => <div key={i.props.title} style={{ display: n === active ? "block" : "none" }}>
                {i}
            </div>)}
            {feet && feet.map((i, n) => <div key={i.props.title} style={{ display: children.length + n === active ? "block" : "none" }}>
                {i}
            </div>)}
        </div>
    </div>;*/

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div className={"sbtSidebar"}>
            <div onClick={() => setSbOpen(!sbOpen)} className={"sbtHandle"}><MdKeyboardArrowLeft /></div>
            {!noHead && <img className={"sbtBrand"} alt={""} src={logo} />}
            {children.map((i, n) =>
                <div key={i.props.title} className={"sbtItem" + (n === active ? " sbtActive" : "")}
                    onClick={() => { setActive(n); setSbOpen(false); onChangeTab && onChangeTab(n) }}>
                    {i.props.title}
                </div>
            )}
            <div style={{ flexGrow: 1 }} />
            {feet && feet.map((i, n) =>
                <div key={i.props.title} style={{ textAlign: "center" }} className={"sbtItem" + (children.length + n === active ? " sbtActive" : "")}
                    onClick={() => { setActive(children.length + n); setSbOpen(false); onChangeTab && onChangeTab(children.length + n) }}>
                    {i.props.title}
                </div>
            )}
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

export const SiteNav = withRouter(({ children, history }) => {
    const api = useContext(apiContext);

    const [sbOpen, setSbOpen] = useState(false);

    useEffect(() =>
        history.listen(() => {
            setSbOpen(false);
        })
    );

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div onMouseDown={() => setSbOpen(false)} className={"sbtBurgerUnderlay"} />
        <div onMouseDown={() => setSbOpen(!sbOpen)} className={"sbtBurger"}><MdMenu /></div>
        <div className={"sbtSidebar"}>
            <hr />
            <SBMenu name={"RACTF"} initial>
                <Link to={"/home"} className={"sbtSubitem"}>Home</Link>
                <Link to={"/users"} className={"sbtSubitem"}>Users</Link>
                <Link to={"/teams"} className={"sbtSubitem"}>Teams</Link>
                <Link to={"/leaderboard"} className={"sbtSubitem"}>Leaderboard</Link>
            </SBMenu>
            <hr />
            {api.authenticated && api.user ? <>
                <SBMenu name={"Challenges"} initial>
                    {api.challenges.map(i =>
                        <Link to={"/campaign/" + i.id} key={i.id} className={"sbtSubitem"}>{i.name}</Link>
                    )}
                </SBMenu>
                <hr />
                <SBMenu name={api.user.username}>
                    <Link to={"/profile/me"} className={"sbtSubitem"}>Profile</Link>
                    <Link to={"/team/me"} className={"sbtSubitem"}>Team</Link>
                    <Link to={"/settings"} className={"sbtSubitem"}>Settings</Link>
                    <Link to={"/logout"} className={"sbtSubitem"}>Logout</Link>
                </SBMenu>
                <hr />
            </> : <>
                <SBMenu name={"Login"} initial>
                    <Link to={"/login"} className={"sbtSubitem"}>Login</Link>
                    <Link to={"/register"} className={"sbtSubitem"}>Register</Link>
                </SBMenu>
                <hr />
            </>}
        </div>

        <div className={"sbtBody"}>
            {children}
        </div>
    </div>;
});


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
