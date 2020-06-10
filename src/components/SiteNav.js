import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';

import {
    Link, SideNav, NavBar, NavBrand, NavGap, Footer, FootRow, FootCol,
    FootLink, NavLink, Container, SiteWrap, NavCollapse, NavMenuLink,
    NavMenu
} from "@ractf/ui-kit";
import { apiContext, apiEndpoints, plugins } from "ractf";
import Wordmark from "./Wordmark";
import Header from "./Header";

import footerLogo from "../static/spine.svg";

const USE_HEAD_NAV = false;


const HeaderNav = () => {
    const api = useContext(apiContext);

    return <NavBar danger>
        <NavBrand><b>RACTF</b></NavBrand>
        <NavCollapse>
            <NavLink to={"/users"}>Users</NavLink>
            <NavLink to={"/teams"}>Teams</NavLink>
            <NavLink to={"/leaderboard"}>Leaderboard</NavLink>
            <NavLink to={"/campaign"}>Challenges</NavLink>
            <NavGap />
            {api.user && <>
                <NavLink to={"/profile/me"}>Profile</NavLink>
                <NavLink to={"/team/me"}>Team</NavLink>
                <NavLink to={"/settings"}>Settings</NavLink>
                <NavLink to={"/logout"}>Logout</NavLink>
            </>}
            {api.user && api.user.is_staff && <NavMenu name={"Admin"}>
                {Object.entries(plugins.adminPage).map(([key, value]) => (
                    <NavMenuLink key={key} to={"/admin/" + key}>{value.sidebar}</NavMenuLink>
                ))}
            </NavMenu>}
        </NavCollapse>
    </NavBar>;
};

const SideBarNav = ({ children }) => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const { t } = useTranslation();

    const login = endpoints.configGet("enable_login", true);
    const registration = endpoints.configGet("enable_registration", true);

    let menu = [];
    menu.push({
        name: t("sidebar.brand"),
        submenu: [
            [t("sidebar.home"), "/home"],
            [t("user_plural"), "/users"],
            [t("team_plural"), "/teams"],
            [t("leaderboard"), "/leaderboard"]
        ],
        startOpen: true
    });

    if (api.user) {
        if (api.user.is_staff || api.challenges.length) {
            let submenu = api.challenges.map(i => [i.name, "/campaign/" + i.id]);
            if (api.user.is_staff) {
                submenu.push([<>+ {t("challenge.new_cat")}</>, "/campaign/new"]);
            }
            menu.push({
                name: t("challenge_plural"),
                submenu: submenu,
                startOpen: true
            });
        }

        menu.push({
            name: api.user.username,
            submenu: [
                [t("settings.profile"), "/profile/me"],
                [t("team"), "/team/me"],
                [t("setting_plural"), "/settings"],
                [t("sidebar.logout"), "/logout"],
            ]
        });
    } else if (login || registration) {
        let submenu = [];
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
    if (api.user && api.user.is_staff) {
        menu.push({
            name: t("sidebar.admin"),
            submenu: Object.entries(plugins.adminPage).map(([key, value]) => [value.sidebar, "/admin/" + key])
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
        <SideNav header={header} footer={footer} items={menu}>
            {children}
        </SideNav>
    </>;
};

export default ({ children }) => {
    if (USE_HEAD_NAV)
        return <SiteWrap>
            <HeaderNav />
            <Container children={children} />
            <Footer>
                <FootRow main danger>
                    <FootCol title={"RACTF"}>
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
                    &copy; Really Awesome Technology Ltd 2020
                </FootRow>
            </Footer>
        </SiteWrap>;
    return <SideBarNav children={children} />;
};


