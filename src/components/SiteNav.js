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
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import {
    Link, SideNav, NavBar, NavBrand, NavGap, Footer, FootRow, FootCol,
    FootLink, NavLink, Container, SiteWrap, NavCollapse, NavMenuLink,
    NavMenu, Wordmark
} from "@ractf/ui-kit";
import Header from "./Header";

import { iteratePlugins } from "@ractf/plugins";
import { useCategories, useExperiment } from "@ractf/util/hooks";
import { useConfig } from "@ractf/util";
import footerLogo from "../static/spine.svg";

const USE_HEAD_NAV = !!process.env.REACT_APP_USE_HEAD_NAV;


const HeaderNav_ = () => {
    const user = useSelector(state => state.user);
    const hasTeams = useConfig("enable_teams");
    const categories = useCategories();

    return <NavBar primary>
        <NavBrand><NavLink to={"/"}><b>{window.env.siteName}</b></NavLink></NavBrand>
        <NavCollapse>
            <NavLink to={"/users"}>Users</NavLink>
            {hasTeams && <NavLink to={"/teams"}>Teams</NavLink>}
            <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
            {categories.length === 1 ? (
                <NavLink to={categories[0].url}>Challenges</NavLink>
            ) : (
                <NavLink to={"/campaign"}>Challenges</NavLink>
            )}
            {user && user.is_staff && <NavLink to={"/campaign/new"}>Add Category</NavLink>}
            <NavGap />
            {user ? <>
                <NavLink to={"/profile/me"}>Profile</NavLink>
                {hasTeams && <NavLink to={"/team/me"}>Team</NavLink>}
                <NavLink to={"/settings"}>Settings</NavLink>
                <NavLink to={"/logout"}>Logout</NavLink>
            </> : <>
                    <NavLink to={"/login"}>Login</NavLink>
                    <NavLink to={"/register"}>Register</NavLink>
                </>}
            {user && user.is_staff && <NavMenu name={"Admin"}>
                {iteratePlugins("adminPage").map(({ key, plugin }) => (
                    <NavMenuLink key={key} to={"/admin/" + key}>{plugin.sidebar}</NavMenuLink>
                ))}
            </NavMenu>}
        </NavCollapse>
    </NavBar>;
};
const HeaderNav = React.memo(HeaderNav_);

const SideBarNav_ = ({ children }) => {
    const { t } = useTranslation();

    const registration = useConfig("enable_registration", true);
    const login = useConfig("enable_login", true);
    const hasTeams = useConfig("enable_teams");
    const user = useSelector(state => state.user);
    const categories = useCategories();

    const menu = [];
    menu.push({
        name: t("sidebar.brand"),
        submenu: [
            [t("sidebar.home"), "/"],
            [t("user_plural"), "/users"],
            hasTeams ? [t("team_plural"), "/teams"] : null,
            [t("leaderboard"), "/leaderboard"]
        ],
        startOpen: true
    });

    if (user) {
        if (user.is_staff || categories.length) {
            const submenu = categories.map(i => [i.name, i.url]);
            if (user.is_staff) {
                submenu.push([<>+ {t("challenge.new_cat")}</>, "/campaign/new"]);
            }
            if (user.is_staff || submenu.length !== 1) {
                menu.push({
                    name: t("challenge_plural"),
                    submenu: submenu,
                    startOpen: true
                });
            } else {
                menu.push({
                    name: t("challenge_plural"),
                    link: categories[0].url,
                });
            }
        }

        menu.push({
            name: user.username,
            submenu: [
                [t("sidebar.profile"), "/profile/me"],
                hasTeams ? [t("team"), "/team/me"] : null,
                [t("setting_plural"), "/settings"],
                [t("sidebar.logout"), "/logout"],
            ]
        });
    } else if (login || registration) {
        const submenu = [];
        if (login)
            submenu.push([t("login"), "/login"]);
        if (registration)
            submenu.push([t("register"), "/register"]);
        menu.push({
            name: t("login"),
            submenu: submenu,
            startOpen: true
        });
    }
    if (user && user.is_staff) {
        menu.push({
            name: t("sidebar.admin"),
            submenu: iteratePlugins("adminPage").map(({ key, plugin }) => [plugin.sidebar, "/admin/" + key])
        });
    }
    const [showDev] = useExperiment("showDev");

    const header = <Wordmark />;
    const footer = <>
        <footer>
            <img alt={""} src={footerLogo} />
            &copy; Really Awesome Technology Ltd 2020
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

    return <>
        <Header />
        <SideNav ractfSidebar header={header} footer={footer} items={menu}>
            {children}
        </SideNav>
    </>;
};
const SideBarNav = React.memo(SideBarNav_);

const SiteNav = ({ children }) => {    
    const [showDev] = useExperiment("showDev");
    if (USE_HEAD_NAV)
        return <SiteWrap>
            <HeaderNav />
            <Container children={children} />
            <Footer>
                <FootRow main>
                    <FootCol title={window.env.siteName}>
                        <FootLink to={"/"}>Home</FootLink>
                        <FootLink to={"/privacy"}>Privacy Policy</FootLink>
                        <FootLink to={"/conduct"}>Terms of Use</FootLink>
                    </FootCol>
                    {showDev && (
                        <FootCol title={"For Developers"}>
                            <FootLink to={"/debug"}>Debug Versions</FootLink>
                            <FootLink to={"/debug/ui"}>UI Framework</FootLink>
                            <FootLink to={"/debug/state"}>State Export</FootLink>
                            <FootLink to={"/debug/experiments"}>Experiments</FootLink>
                        </FootCol>
                    )}
                </FootRow>
                <FootRow center slim darken column>
                    <p>Powered with <span role="img" aria-label="red heart">&#10084;&#65039;</span> by RACTF</p>
                    <p>&copy; Really Awesome Technology Ltd 2020</p>
                    {window.env.footerText && <p>{window.env.footerText}</p>}
                </FootRow>
            </Footer>
        </SiteWrap>;
    return <SideBarNav children={children} />;
};
export default React.memo(SiteNav);
