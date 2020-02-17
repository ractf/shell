import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";

import { TeamsList, UsersList } from "../pages/Lists";
import PasswordReset from "../pages/auth/PasswordReset";
import ChallengePage from "../pages/ChallengePage";
import SettingsPage from "../pages/SettingsPage";
import { NotFound } from "../pages/ErrorPages";
import Leaderboard from "../pages/Leaderboard";
import AdminPage from "../pages/AdminPage";
import PostLogin from "../pages/auth/PostLogin";
import HomePage from "../pages/HomePage";
import TeamPage from "../pages/TeamPage";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import Debug from "../pages/Debug";
import TwoFA from "../pages/TwoFA";

import { EmailVerif, EmailMessage } from "../pages/auth/EmailVerif";
import { JoinTeam, CreateTeam } from "../pages/auth/Teams";

import { APIContext, APIEndpoints } from "./Contexts";

import { plugins } from "ractf";

const Loading = () => "Loading";
const asyncRoute = (loader) => (
    Loadable({
        loader: loader,
        loading: Loading,
    })
);

const Campaign = asyncRoute(() => import("../pages/Campaign"));
const Profile = asyncRoute(() => import("../pages/Profile"));


const Logout = () => {
    useContext(APIEndpoints).logout();
    return <Redirect to={"/home"} />;
};


const Page = ({ title, auth, admin, noAuth, C }) => {
    const api = useContext(APIContext);
    if (title !== null)
        document.title = title || "RACTF";

    if (auth && !api.authenticated) return <Redirect to={"/login"} />;
    if (noAuth && api.authenticated) return <Redirect to={"/home"} />;
    if (admin && (!api.user || !api.user.is_admin)) return <Redirect to={"/home"} />;

    return <C />;
};


export default () => {
    return <Switch>
        <Route exact path={"/debug"} component={Debug} />

        <Redirect exact path={"/"} to={"/home"} />
        <Route exact path={"/logout"} component={Logout} />
        <Route exact path={"/login"}>
            <Page title={"Login"} noAuth C={Login} />
        </Route>
        <Route exact path={"/register"}>
            <Page title={"Register"} noAuth C={SignUp} />
        </Route>
        <Route exact path={"/register/email"}>
            <Page title={"Register"} noAuth C={EmailMessage} />
        </Route>
        <Route exact path={"/verify"}>
            <Page title={"Verify"} C={EmailVerif} />
        </Route>

        <Route exact path={"/password_reset"}>
            <Page title={"Reset Password"} C={PasswordReset} />
        </Route>

        <Route exact path={"/team/join"}>
            <Page title={"Join Team"} auth C={JoinTeam} />
        </Route>
        <Route exact path={"/team/new"}>
            <Page title={"New Team"} auth C={CreateTeam} />
        </Route>

        <Route exact path={"/home"}>
            <Page title={"Home"} C={HomePage} />
        </Route>

        <Redirect from={"/admin"} to={"/admin/config"} exact />
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
            <Page title={"Challenges"} auth C={ChallengePage} />
        </Route>
        <Route exact path={"/campaign"}>
            <Page title={"Challenges"} auth C={Campaign} />
        </Route>
        <Route exact path={"/campaign/:tabId"}>
            <Page title={"Challenges"} auth C={Campaign} />
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

        <Redirect path={"/team"} to={"/team/me"} exact />
        <Route exact path={"/team/:team"}>
            <Page title={"Team"} auth C={TeamPage} />
        </Route>
        <Route exact path={"/noteam"}>
            <Page title={"Where now?"} auth C={PostLogin} />
        </Route>

        {Object.keys(plugins.page).map(url =>
            <Route exact path={url} key={url} component={plugins.page[url]} />
        )}

        <Route>
            <Page title={"Error"} C={NotFound} />
        </Route>
    </Switch>;
};
