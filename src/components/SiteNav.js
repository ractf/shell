import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';

import { Link, SideNav } from "@ractf/ui-kit";
import { apiContext, apiEndpoints, plugins } from "ractf";
import Wordmark from "./Wordmark";

import footerLogo from "../static/spine.svg";


export default ({ children }) => {
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
        <div className="sbtfCopy">
            <img alt={""} src={footerLogo} />
            &copy; Really Awesome Technology Ltd 2020
        </div>
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

    return <SideNav header={header} footer={footer} items={menu}>
        {children}
    </SideNav>;
};
