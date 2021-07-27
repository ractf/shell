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

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FiBarChart2, FiHome, FiLogIn, FiLogOut, FiPlus, FiSettings, FiUser, FiUsers } from "react-icons/fi";

import {
    SideNav, NavBar, NavBrand, NavGap, Footer, FootRow, FootCol,
    Container, SiteWrap, NavCollapse, NavMenu, Wordmark, NavItem, Scrollbar
} from "@ractf/ui-kit";
import { iteratePlugins } from "@ractf/plugins";
import { useCategories, useExperiment, useConfig } from "@ractf/shell-util";
import { useReactRouter } from "@ractf/util";

import footerLogo from "../static/spine.svg";
import Link from "./Link";


const USE_HEAD_NAV = !!process.env.REACT_APP_USE_HEAD_NAV;

const HeaderNav_ = () => {
    const user = useSelector(state => state.user);
    const hasTeams = useConfig("enable_teams");
    const categories = useCategories();

    return <NavBar primary>
        <NavBrand><Link to={"/"}><b>{window.env.siteName}</b></Link></NavBrand>
        <NavCollapse>
            <NavItem><Link to={"/users"}>Users</Link></NavItem>
            {hasTeams && <NavItem><Link to={"/teams"}>Teams</Link></NavItem>}
            <NavItem><Link to={"/leaderboard"}>Leaderboard</Link></NavItem>
            {categories.length === 1 ? (
                <NavItem><Link to={categories[0].url}>Challenges</Link></NavItem>
            ) : (
                    <NavItem><Link to={"/campaign"}>Challenges</Link></NavItem>
                )}
            {user && user.is_staff && <NavItem>
                <Link to={"/campaign/new"}>Add Category</Link>
            </NavItem>}
            <NavGap />
            {user ? <>
                <NavItem><Link to={"/profile/me"}>Profile</Link></NavItem>
                {hasTeams && <NavItem><Link to={"/team/me"}>Team</Link></NavItem>}
                <NavItem><Link to={"/settings"}>Settings</Link></NavItem>
                <NavItem><Link to={"/logout"}>Logout</Link></NavItem>
            </> : <>
                    <NavItem><Link to={"/login"}>Login</Link></NavItem>
                    <NavItem><Link to={"/register"}>Register</Link></NavItem>
                </>}
            {user && user.is_staff && <NavMenu name={"Admin"}>
                {iteratePlugins("adminPage").map(({ key, plugin }) => (
                    <Link key={key} to={"/admin/" + key}>{plugin.sidebar}</Link>
                ))}
            </NavMenu>}
        </NavCollapse>
    </NavBar>;
};
const HeaderNav = React.memo(HeaderNav_);

const SideNavLink = ({ to, Icon, active, name }) => {
    const { location: { pathname } } = useReactRouter();
    return (
        <Link to={to}>
            <SideNav.Item active={active || pathname === to} Icon={Icon}>
                {name}
            </SideNav.Item>
        </Link>
    );
};

const SideBarNav_ = ({ children }) => {
    const { t } = useTranslation();

    const registration = useConfig("enable_registration", true);
    const login = useConfig("enable_login", true);
    const hasTeams = useConfig("enable_teams");
    const user = useSelector(state => state.user);
    const categories = useCategories();

    const [showDev] = useExperiment("showDev");

    const header = <Wordmark />;
    const footer = <>
        <footer>
            <img alt={""} src={footerLogo} />
            <p>{t("copyright_note")}</p>
        </footer>
        <p>Powered with <span role="img" aria-label="red heart">&#10084;&#65039;</span> by RACTF</p>
        {window.env.footerText && <p>{window.env.footerText}</p>}
        <Link to="/">
            {t("footer.home")}
        </Link> - <Link to="/privacy">
            {t("footer.privacy")}
        </Link> - <Link to="/conduct">
            {t("footer.terms")}
        </Link>{showDev && <>
            <br /><Link to="/debug">
                Debug Versions
            </Link> - <Link to="/debug/ui">
                UI Framework
            </Link>
            <br /><Link to="/debug/state">
                State Export
            </Link> - <Link to="/debug/experiments">
                Experiments
            </Link>
        </>}
    </>;

    const { location: { pathname } } = useReactRouter();

    const items = <>
        <SideNavLink to={"/"} Icon={FiHome} name={t("sidebar.home")} />
        <SideNavLink to={"/users"} Icon={FiUser} name={t("user_plural")} />
        {hasTeams && (
            <SideNavLink to={"/teams"} Icon={FiUsers} name={t("team_plural")} />
        )}
        <SideNavLink to={"/leaderboard"} Icon={FiBarChart2} name={t("leaderboard")} />

        {user ? <>
            {(user.is_staff || categories.length > 1) && (
                <SideNav.UncontrolledSubMenu name={t("challenge_plural")} startOpen>
                    {categories.map(i => (
                        <SideNavLink key={i.id} to={i.url} name={i.name} />
                    ))}
                    {user.is_staff && (
                        <SideNavLink to={"/campaign/new"} name={t("challenge.new_cat")} Icon={FiPlus} />
                    )}
                </SideNav.UncontrolledSubMenu>
            )}
            {(!user.is_staff && categories.length === 1) && (
                <Link to={categories[0].url}><SideNav.Item>{t("challenge_plural")}</SideNav.Item></Link>
            )}
            <SideNav.UncontrolledSubMenu name={user.username}>
                <SideNavLink to={"/profile/me"} Icon={FiUser} name={t("sidebar.profile")} />
                {hasTeams && (
                    <SideNavLink to={"/team/me"} Icon={FiUsers} name={t("team")} />
                )}
                <SideNavLink to={"/settings"} Icon={FiSettings} name={t("setting_plural")} />
                <SideNavLink to={"/logout"} Icon={FiLogOut} name={t("sidebar.logout")} />
            </SideNav.UncontrolledSubMenu>
            {user.is_staff && (
                <SideNav.UncontrolledSubMenu name={t("sidebar.admin")}>
                    {iteratePlugins("adminPage").map(({ key, plugin }) => (
                        <SideNavLink
                            to={`/admin/${key}`} key={key}
                            Icon={plugin.Icon} name={plugin.sidebar}
                        />
                    ))}
                </SideNav.UncontrolledSubMenu>
            )}
        </> : <>
                {(login || registration) && (
                    <SideNav.UncontrolledSubMenu name={t("account")} startOpen>
                        {login && <Link to={"/login"}>
                            <SideNav.Item active={pathname === "/login"} Icon={FiLogIn}>
                                {t("login")}
                            </SideNav.Item>
                        </Link>}
                        {registration && <Link to={"/register"}>
                            <SideNav.Item active={pathname === "/register"}>
                                {t("register")}
                            </SideNav.Item>
                        </Link>}
                    </SideNav.UncontrolledSubMenu>
                )}
            </>}
    </>;

    return <>
        <SideNav sidebarType header={header} footer={footer} items={items}>
            {children}
        </SideNav>
    </>;
};
const SideBarNav = React.memo(SideBarNav_);

const SiteNav = ({ children }) => {
    const { t } = useTranslation();
    const [showDev] = useExperiment("showDev");
    if (USE_HEAD_NAV)
        return <SiteWrap>
            <Scrollbar style={{ height: "100vh" }} primary>
                <SiteWrap>
                    <HeaderNav />
                    <Container full children={children} />
                    <Footer>
                        <FootRow main>
                            <FootCol title={window.env.siteName}>
                                <Link to={"/"}>Home</Link>
                                <Link to={"/privacy"}>Privacy Policy</Link>
                                <Link to={"/conduct"}>Terms of Use</Link>
                            </FootCol>
                            {showDev && (
                                <FootCol title={"For Developers"}>
                                    <Link to={"/debug"}>Debug Versions</Link>
                                    <Link to={"/debug/ui"}>UI Framework</Link>
                                    <Link to={"/debug/state"}>State Export</Link>
                                    <Link to={"/debug/experiments"}>Experiments</Link>
                                </FootCol>
                            )}
                        </FootRow>
                        <FootRow center slim darken column>
                            <p>Powered with <span role="img" aria-label="red heart">&#10084;&#65039;</span> by RACTF</p>
                            <p>{t("copyright_note")}</p>
                            {window.env.footerText && <p>{window.env.footerText}</p>}
                        </FootRow>
                    </Footer>
                </SiteWrap>
            </Scrollbar>
        </SiteWrap>;
    return <SideBarNav children={children} />;
};
export default React.memo(SiteNav);
