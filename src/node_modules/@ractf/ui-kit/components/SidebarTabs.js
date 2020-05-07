import React, { useState, useRef, useContext } from "react";
import { MdKeyboardArrowLeft, MdMenu } from "react-icons/md";
import { useTranslation } from 'react-i18next';

import { Link } from "@ractf/ui-kit";
import { apiContext, apiEndpoints, fastClick, plugins } from "ractf";
import Scrollbar from "./Scrollbar";
import Wordmark from "./Wordmark";

import footerLogo from "static/spine.svg";

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
                    {(api.user.is_staff || api.challenges.length)
                        ? <SBMenu key={"challenges"} name={t("challenge_plural")} initial>
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
                        </SBMenu> : null
                    }
                    <SBMenu key={"user"} name={api.user.username}>
                        <Link onClick={close} to={"/profile/me"} className={"sbtSubitem"}>{t("settings.profile")}</Link>
                        <Link onClick={close} to={"/team/me"} className={"sbtSubitem"}>{t("team")}</Link>
                        <Link onClick={close} to={"/settings"} className={"sbtSubitem"}>{t("setting_plural")}</Link>
                        <Link onClick={close} to={"/logout"} className={"sbtSubitem"}>{t("sidebar.logout")}</Link>
                    </SBMenu>
                </> : (
                    endpoints.configGet("enable_login", true) || endpoints.configGet("enable_registration", true)
                ) ? <>
                    <SBMenu key={"login"} name={t("login")} initial>
                        {endpoints.configGet("enable_login", true) &&
                            <Link onClick={close} key={"login"} to={"/login"} className={"sbtSubitem"}>
                                {t("login")}
                            </Link>}
                        {endpoints.configGet("enable_registration", true) &&
                            <Link onClick={close} key={"register"} to={"/register"} className={"sbtSubitem"}>
                                {t("register")}
                            </Link>}
                    </SBMenu>
                </> : null}
                {api.user && api.user.is_staff && <>
                    <SBMenu key={"admin"} name={t("sidebar.admin")}>
                        {Object.entries(plugins.adminPage).map(([key, value]) => (
                            <Link onClick={close} to={"/admin/" + key} className={"sbtSubitem"}>
                                {value.sidebar}
                            </Link>
                        ))}
                    </SBMenu>
                </>}

                <div className="sbtSkip" />
                <div className="sbtFoot">
                    <div className="sbtfCopy">
                        <img alt={""} src={footerLogo} />
                    &copy; Really Awesome Technology Ltd 2020
                </div>
                    <Link to="/">{t("footer.home")}</Link> - <
                        Link to="/privacy">{t("footer.privacy")}</Link> - <
                            Link to="/conduct">{t("footer.terms")}</Link><br />
                    <Link to="/ui">UI Framework</Link> - <
                        Link to="/debug">Debug</Link>
                </div>
            </div>
        </Scrollbar>

        {children}
    </div>;
};


export const SBTSection = ({ title, children, subTitle, back, noHead }) => {
    return <>
        {!noHead && <div className={"abTitle"}>{title}{back && <div className={"abBack"}>
            {back}
        </div>}{subTitle && <div className={"abSub"}>
            {subTitle}
        </div>}</div>}
        {children}
    </>;
};


export const Section = ({ title, children }) => <>
    <div className={"abSection"}>
        <div className={"absTitle"}>{title}</div>
        <div className={"absBody"}>
            {children}
        </div>
    </div>
</>;
