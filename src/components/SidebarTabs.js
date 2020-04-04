import React, { useState, useRef, useContext } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";
import { useTranslation } from 'react-i18next';

import { apiContext, apiEndpoints, Link, fastClick } from "ractf";
import Scrollbar from "./Scrollbar";
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
            {children && children.length && <MdKeyboardArrowLeft />}{name}
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
    const { t } = useTranslation();

    const [sbOpen, setSbOpen] = useState(false);

    const close = () => setSbOpen(false);

    return <div className={"sbtWrap" + (sbOpen ? " sbtOpen" : "")}>
        <div onClick={() => setSbOpen(false)} {...fastClick} className={"sbtBurgerUnderlay"} />
        <div onClick={() => setSbOpen(!sbOpen)} {...fastClick} className={"sbtBurger"}><MdMenu /></div>
        <Scrollbar className={"sbtSidebar"}>
            <div className={"sbtsInner"}>
                <div className={"sbtHead"}>
                    <Wordmark />
                </div>

                <SBMenu key={"ractf"} name={t("sidebar.brand")} initial>
                    <Link onClick={close} to={"/home"} className={"sbtSubitem"}>{t("sidebar.home")}</Link>
                    <Link onClick={close} to={"/users"} className={"sbtSubitem"}>{t("user_plural")}</Link>
                    <Link onClick={close} to={"/teams"} className={"sbtSubitem"}>{t("team_plural")}</Link>
                    <Link onClick={close} to={"/leaderboard"} className={"sbtSubitem"}>{t("leaderboard")}</Link>
                </SBMenu>
                {api.user ? <>
                    <SBMenu key={"challenges"} name={t("challenge_plural")} initial>
                        {api.challenges.map(i =>
                            <Link onClick={close} to={"/campaign/" + i.id} key={i.id} className={"sbtSubitem"}>
                                {i.name}
                            </Link>
                        )}
                        {api.user.is_staff &&
                            <Link onClick={close} to={"/campaign/new"} key={"newcat"} className={"sbtSubitem"}>
                                + {t("challenge.new_cat")}
                            </Link>
                        }
                    </SBMenu>
                    <SBMenu key={"user"} name={api.user.username}>
                        <Link onClick={close} to={"/profile/me"} className={"sbtSubitem"}>{t("settings.profile")}</Link>
                        <Link onClick={close} to={"/team/me"} className={"sbtSubitem"}>{t("team")}</Link>
                        <Link onClick={close} to={"/settings"} className={"sbtSubitem"}>{t("setting_plural")}</Link>
                        <Link onClick={close} to={"/logout"} className={"sbtSubitem"}>{t("logout")}</Link>
                    </SBMenu>
                </> : (endpoints.configGet("login", true) || endpoints.configGet("register", true)) ? <>
                    <SBMenu key={"login"} name={t("login")} initial>
                        {endpoints.configGet("login", true) &&
                            <Link onClick={close} key={"login"} to={"/login"} className={"sbtSubitem"}>
                                {t("login")}
                            </Link>}
                        {endpoints.configGet("register", true) &&
                            <Link onClick={close} key={"register"} to={"/register"} className={"sbtSubitem"}>
                                {t("register")}
                            </Link>}
                    </SBMenu>
                </> : null}
                {api.user && api.user.is_staff && <>
                    <SBMenu key={"admin"} name={t("sidebar.admin")}>
                        <Link onClick={close} to={"/admin/ctf"} className={"sbtSubitem"}>
                            {t("admin.event")}
                        </Link>
                        <Link onClick={close} to={"/admin/config"} className={"sbtSubitem"}>
                            {t("adminconfiguration")}
                        </Link>
                        <Link onClick={close} to={"/admin/port"} className={"sbtSubitem"}>
                            {t("admin.import_export")}
                        </Link>
                        <Link onClick={close} to={"/admin/service"} className={"sbtSubitem"}>
                            {t("admin.status")}
                        </Link>
                        <Link onClick={close} to={"/admin/announcements"} className={"sbtSubitem"}>
                            {t("admin.announce.head")}
                        </Link>
                        <Link onClick={close} to={"/admin/members"} className={"sbtSubitem"}>
                            {t("admin.members")}
                        </Link>
                        <Link onClick={close} to={"/admin/teams"} className={"sbtSubitem"}>
                            {t("admin.teams")}
                        </Link>
                    </SBMenu>
                </>}

                <div className="sbtSkip" />
                <div className="sbtFoot">
                    <div className="sbtfCopy">
                        <img alt={""} src={"https://ractf.co.uk/static/img/spine.png"} />
                    &copy; Really Awesome Technology Ltd 2020
                </div>
                    <a href="/">{t("footer.home")}</a> -
                    <a href="/privacy">{t("footer.privacy")}</a> -
                    <a href="/terms">{t("footer.terms")}</a>
                </div>
            </div>
        </Scrollbar>

        {children}
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
