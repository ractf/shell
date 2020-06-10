import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { NotFound, BrokenShards } from "../pages/ErrorPages";
import { TeamsList, UsersList } from "../pages/Lists";
import Countdown from "../pages/Countdown";
import TeamPage from "../pages/TeamPage";

import { Row, TextBlock, Page as BasePage, H1, H2 } from "@ractf/ui-kit";
import { apiContext, apiEndpoints, plugins, dynamicLoad } from "ractf";


const ChallengePage = dynamicLoad(() => import("../pages/ChallengePage"));
const SettingsPage = dynamicLoad(() => import("../pages/SettingsPage"));
const Leaderboard = dynamicLoad(() => import("../pages/Leaderboard"));
const AdminPage = dynamicLoad(() => import("../pages/AdminPage"));
const Campaign = dynamicLoad(() => import("../pages/Campaign"));
const Profile = dynamicLoad(() => import("../pages/Profile"));
const TwoFA = dynamicLoad(() => import("../pages/TwoFA"));
const UI = dynamicLoad(() => import("../pages/UI"));


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        Object.values(plugins.errorHandler).forEach(i => {
            if (typeof i === "function") i(error, errorInfo);
        });
    }

    render() {
        if (this.state.error) {
            return <BasePage centre>
                <BrokenShards />
                <H1>This page failed to load.</H1>
                <H2>Please report this!</H2>
                <TextBlock style={{textAlign: "left"}}>{this.state.error.stack}</TextBlock>
            </BasePage>;
        }

        return this.props.children;
    }
}


const Page = ({ title, auth, admin, noAuth, countdown, children, C }) => {
    const api = useContext(apiContext);
    //if (!process.env.REACT_APP_NO_SITE_LOCK) {
        if (!(api.user && api.user.is_staff)) {
            if (countdown)
                if (!api.countdown.passed[countdown])
                    return <Countdown cdKey={countdown} />;
        }
    //}

    if (title !== null)
        document.title = title || "RACTF";

    if (auth && !api.authenticated) return <Redirect to={"/login"} />;
    if (noAuth && api.authenticated) return <Redirect to={"/home"} />;
    if (admin && (!api.user || !api.user.is_staff)) return <Redirect to={"/home"} />;

    return <ErrorBoundary>
        {C ? <C /> : children}
    </ErrorBoundary>;
};

const URIHandler = () => {
    return <Redirect to={decodeURIComponent(window.location.search).split(":", 2)[1]} />;
};

const Login = () => {
    let api = useContext(apiEndpoints);
    let provider = api.configGet("login_provider") || "basicAuth";
    if (plugins.loginProvider[provider])
        return React.createElement(plugins.loginProvider[provider].component);
    return <BasePage centre>
        <Row><p>Login provider plugin missing for <code>{provider}</code>.</p></Row>
    </BasePage>;
};
const Register = () => {
    let api = useContext(apiEndpoints);
    let provider = api.configGet("registration_provider") || "basicAuth";
    if (plugins.registrationProvider[provider])
        return React.createElement(plugins.registrationProvider[provider].component);
    return <BasePage centre>
        <Row><p>Registration provider plugin missing for <code>{provider}</code>.</p></Row>
    </BasePage>;
};
const Logout = () => {
    useContext(apiEndpoints).logout();
    return <Redirect to={"/home"} />;
};


const Routes = () => {
    return <Switch>
        {Object.entries(plugins.page).map(([url, page]) =>
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
export default Routes;
