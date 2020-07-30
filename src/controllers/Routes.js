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

import React, { useEffect } from "react";
import { Switch as Switch_, Route as Route_, Redirect as Redirect_ } from "react-router-dom";
import { useSelector } from "react-redux";

import { NotFound, BrokenShards } from "../pages/ErrorPages";
import { TeamsList, UsersList } from "../pages/Lists";
import Countdown from "../pages/Countdown";
import TeamPage from "../pages/TeamPage";

import { TextBlock, Page as BasePage, H1, H2 } from "@ractf/ui-kit";
import { iteratePlugins, PluginComponent } from "@ractf/plugins";
import { dynamicLoad } from "ractf";
import { useConfig } from "@ractf/util";
import { logout } from "@ractf/api";

const Route = React.memo(Route_);
const Switch = React.memo(Switch_);
const Redirect = React.memo(Redirect_);

const ChallengePage = dynamicLoad(() => import(/* webpackChunkName: "challenge-page" */ "../pages/ChallengePage"));
const SettingsPage = dynamicLoad(() => import(/* webpackChunkName: "settings-page" */ "../pages/SettingsPage"));
const Leaderboard = dynamicLoad(() => import(/* webpackChunkName: "leaderboard" */ "../pages/Leaderboard"));
const AdminPage = dynamicLoad(() => import(/* webpackChunkName: "admin-page" */ "../pages/AdminPage"));
const Campaign = dynamicLoad(() => import(/* webpackChunkName: "campaign" */ "../pages/Campaign"));
const Profile = dynamicLoad(() => import(/* webpackChunkName: "profile" */ "../pages/Profile"));
const TwoFA = dynamicLoad(() => import(/* webpackChunkName: "2fa" */ "../pages/TwoFA"));
const UI = dynamicLoad(() => import(/* webpackChunkName: "ui" */ "../pages/UI"));


class ErrorBoundary extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        iteratePlugins("errorHandler").forEach(({ plugin }) => {
            if (typeof plugin === "function")
                plugin(error, errorInfo);
        });
    }

    render() {
        if (this.state.error) {
            return <BasePage centre>
                <BrokenShards />
                <H1>This page failed to load.</H1>
                <H2>Please report this!</H2>
                <TextBlock style={{ textAlign: "left" }}>{this.state.error.stack}</TextBlock>
            </BasePage>;
        }

        return this.props.children;
    }
}


let Page = ({ title, auth, admin, noAuth, countdown, children, C }) => {
    const user = useSelector(state => state.user);
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};
    //if (!process.env.REACT_APP_NO_SITE_LOCK) {
    if (!(user && user.is_staff)) {
        if (countdown)
            if (!countdown_passed[countdown])
                return <Countdown cdKey={countdown} />;
    }
    //}

    if (title !== null)
        document.title = title || process.env.REACT_APP_SITE_NAME;

    if (auth && !user) return <Redirect to={"/login"} />;
    if (noAuth && user) return <Redirect to={"/home"} />;
    if (admin && (!user || !user.is_staff)) return <Redirect to={"/home"} />;

    return <ErrorBoundary>
        {C ? <C /> : children}
    </ErrorBoundary>;
};
Page = React.memo(Page);

const URIHandler = () => {
    return <Redirect to={decodeURIComponent(window.location.search).split(":", 2)[1]} />;
};

const Login = () => {
    const provider = useConfig("login_provider", "basicAuth");
    return <PluginComponent type={"loginProvider"} name={provider} />;
};
const Register = () => {
    const provider = useConfig("registration_provider", "basicAuth");
    return <PluginComponent type={"registrationProvider"} name={provider} />;
};
const Logout = () => {
    useEffect(() => {
        logout();
    }, []);
    return <Redirect to={"/home"} />;
};


const Routes = () => {
    return <Switch>
        {iteratePlugins("page").map(({ key: url, plugin: page }) =>
            <Route exact path={url} key={url}>
                <Page title={page.title} auth={page.auth} countdown={page.countdown}
                    admin={page.admin} noAuth={page.noAuth} C={page.component} />
            </Route>
        )}

        <Route exact path={"/uri"} component={URIHandler} />

        <Redirect exact path={"/"} to={"/home"} />
        <Route exact path={"/home"}>
            <Page countdown={"registration_open"} auth>
                <Redirect to={"/campaign"} />
            </Page>
        </Route>
        <Route exact path={"/logout"} component={Logout} />
        <Route exact path={"/login"}>
            <Page title={"Login"} noAuth C={Login} />
        </Route>
        <Route exact path={"/register"}>
            <Page countdown={"registration_open"} title={"Register"} noAuth C={Register} />
        </Route>

        <Route exact path={"/admin/:page"}>
            <Page title={"Admin"} auth admin C={AdminPage} />
        </Route>

        <Route exact path={"/settings"}>
            <Page title={"Settings"} auth C={SettingsPage} />
        </Route>
        <Route exact path={"/settings/2fa"}>
            <Page title={"Settings"} auth C={TwoFA} />
        </Route>

        <Route exact path={"/campaign/:tabId/challenge/:chalId"}>
            <Page countdown={"countdown_timestamp"} title={"Challenges"} auth C={ChallengePage} />
        </Route>
        <Route exact path={"/campaign"}>
            <Page countdown={"countdown_timestamp"} title={"Challenges"} auth C={Campaign} />
        </Route>
        <Route exact path={"/campaign/:tabId"}>
            <Page countdown={"countdown_timestamp"} title={"Challenges"} auth C={Campaign} />
        </Route>

        <Redirect path={"/profile"} to={"/profile/me"} exact />
        <Route exact path={"/profile/:user"}>
            <Page title={null} auth C={Profile} />
        </Route>

        <Route exact path={"/users"}>
            <Page title={"Users"} C={UsersList} />
        </Route>
        <Route exact path={"/teams"}>
            <Page title={"Teams"} C={TeamsList} />
        </Route>

        <Route exact path={"/leaderboard"}>
            <Page title={"Leaderboard"} C={Leaderboard} />
        </Route>

        <Route exact path={"/ui"}>
            <Page title={"UI"} C={UI} />
        </Route>

        <Redirect path={"/team"} to={"/team/me"} exact />
        <Route exact path={"/team/:team"}>
            <Page title={"Team"} auth C={TeamPage} />
        </Route>

        <Route>
            <Page title={"Error"} C={NotFound} />
        </Route>
    </Switch>;
};
export default React.memo(Routes);
