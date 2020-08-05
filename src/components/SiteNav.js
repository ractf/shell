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
import { useCategories } from "@ractf/util/hooks";
import { useConfig } from "@ractf/util";
import footerLogo from "../static/spine.svg";

const USE_HEAD_NAV = !process.env.REACT_APP_USE_HEAD_NAV;


const HeaderNav_ = () => {
    const user = useSelector(state => state.user);
    const hasTeams = useConfig("enable_teams");

    return <NavBar primary>
        <NavBrand><NavLink to={"/"}><b>{process.env.REACT_APP_SITE_NAME}</b></NavLink></NavBrand>
        <NavCollapse>
            <NavLink to={"/users"}>Users</NavLink>
            {hasTeams && <NavLink to={"/teams"}>Teams</NavLink>}
            <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
            <NavLink to={"/campaign"}>Challenges</NavLink>
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
            [t("sidebar.home"), "/home"],
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
            menu.push({
                name: t("challenge_plural"),
                submenu: submenu,
                startOpen: true
            });
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

    const header = <Wordmark />;
    const footer = <>
        <footer>
            <img alt={""} src={footerLogo} />
            &copy; Really Awesome Technology Ltd 2020
        </footer>
        <Link to="/">
            {t("footer.home")}
        </Link> - <Link to="/privacy">
            {t("footer.privacy")}
        </Link> - <Link to="/conduct">
            {t("footer.terms")}
        </Link><br /><Link to="/ui">
            UI Framework
        </Link> - <Link to="/debug">
            Debug
        </Link>
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
    if (USE_HEAD_NAV)
        return <SiteWrap>
            <HeaderNav />
            <Container children={children} />
            <Footer>
                <FootRow main>
                    <FootCol title={process.env.REACT_APP_SITE_NAME}>
                        <FootLink to={"/home"}>Home</FootLink>
                        <FootLink to={"/privacy"}>Privacy Policy</FootLink>
                        <FootLink to={"/conduct"}>Terms of Use</FootLink>
                    </FootCol>
                    <FootCol title={"For Developers"}>
                        <FootLink to={"/ui"}>UI Framework</FootLink>
                        <FootLink to={"/debug"}>Debug</FootLink>
                    </FootCol>
                </FootRow>
                <FootRow center slim darken>
                    <center>
                    &copy; Really Awesome Technology Ltd 2020
                    <br/>
                    Organized by the CD Community, hosted by RACTF.
                    </center>
                </FootRow>
            </Footer>
        </SiteWrap>;
    return <SideBarNav children={children} />;
};
export default React.memo(SiteNav);
