import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";

import { NotFound, BrokenShards } from "../pages/ErrorPages";
import { TeamsList, UsersList } from "../pages/Lists";
import PasswordReset from "../pages/auth/PasswordReset";
import ChallengePage from "../pages/ChallengePage";
import SettingsPage from "../pages/SettingsPage";
import Leaderboard from "../pages/Leaderboard";
import AdminPage from "../pages/AdminPage";
import Countdown from "../pages/Countdown";
import PostLogin from "../pages/auth/PostLogin";
import HomePage from "../pages/HomePage";
import TeamPage from "../pages/TeamPage";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import Debug from "../pages/Debug";
import TwoFA from "../pages/TwoFA";
import UI from "../pages/UI";

import { EmailVerif, EmailMessage } from "../pages/auth/EmailVerif";
import { JoinTeam, CreateTeam } from "../pages/auth/Teams";

import { APIContext, APIEndpoints } from "./Contexts";

import { plugins, TextBlock, SectionHeading, SectionTitle2 } from "ractf";

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


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
    }

    render() {
        if (this.state.error) {
            return <div className="sbtBody"><div className={"pageContent vCentre"}>
                <BrokenShards />
                <SectionHeading>This page failed to load.</SectionHeading>
                <SectionTitle2>Please report this!</SectionTitle2>
                <TextBlock style={{textAlign: "left"}}>{this.state.error.stack}</TextBlock>
            </div></div>;
        }

        return this.props.children;
    }
}


const Page = ({ title, auth, admin, noAuth, lockout, C }) => {
    const api = useContext(APIContext);
    if (!process.env.REACT_APP_NO_SITE_LOCK)
        if (lockout && !(api.user && api.user.is_staff))
            if (!api.siteOpen) return <Countdown />;

    if (title !== null)
        document.title = title || "RACTF";

    if (auth && !api.authenticated) return <Redirect to={"/login"} />;
    if (noAuth && api.authenticated) return <Redirect to={"/home"} />;
    if (admin && (!api.user || !api.user.is_staff)) return <Redirect to={"/home"} />;

    return <ErrorBoundary><C /></ErrorBoundary>;
};

const URIHandler = () => {
    return <Redirect to={decodeURIComponent(window.location.search).split(":", 2)[1]} />;
};

export default () => {
    return <Switch>
        <Route exact path={"/uri"} component={URIHandler} />
        <Route exact path={"/debug"} >
            <Page title={"Debug"} C={Debug} />
        </Route>

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
            <Page lockout title={"Challenges"} auth C={ChallengePage} />
        </Route>
        <Route exact path={"/campaign"}>
            <Page lockout title={"Challenges"} auth C={Campaign} />
        </Route>
        <Route exact path={"/campaign/:tabId"}>
            <Page lockout title={"Challenges"} auth C={Campaign} />
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
