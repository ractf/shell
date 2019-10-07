import React, { useContext } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import styled from "styled-components";

import { TeamsList, UsersList } from "../pages/Lists";
import SettingsPage from "../pages/SettingsPage";
import { NotFound } from "../pages/ErrorPages";
import Leaderboard from "../pages/Leaderboard";

import { EmailVerif, EmailMessage } from "../pages/auth/EmailVerif";
import { JoinTeam, CreateTeam } from "../pages/auth/Teams";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";

import TeamPage from "../pages/TeamPage";
import HomePage from "../pages/HomePage";
import Campaign from "../pages/Campaign";
import Profile from "../pages/Profile";
import { APIContext } from "./Contexts";

import { plugins } from "ractf";


class Fader extends React.Component {
    constructor(props) {
        super(props);

        this.fadeSpeed = 100;

        this.state = {
            opacity: 1,

            curChild: props.children,
            curUniqId: props.uniqId,
            prevChild: null,
            prevUniqId: null,
            animationCallback: null
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const prevUniqId = prevProps.uniqKey || prevProps.children.type;
        const uniqId = this.props.uniqKey || this.props.children.type;

        if (prevUniqId !== uniqId) {
            this.setState({
                opacity: 0,

                curChild: this.props.children,
                curUniqId: uniqId,
                prevChild: prevProps.children,
                prevUniqId,
                animationCallback: this.swapChildren
            });

            setTimeout(() => {
                this.swapChildren()
            }, this.fadeSpeed / 2);
        }
    }

    swapChildren = () => {
        this.setState({
            opacity: 1,

            prevChild: null,
            prevUniqId: null,
            animationCallback: null
        });
    };

    render() {
        return (
            <Container style={{ opacity: this.state.opacity, transition: "opacity " + this.fadeSpeed + "ms ease" }}>
                {this.state.prevChild || this.state.curChild}
            </Container>
        );
    }
}

const Container = styled.div`
    /*width: 100%;
    text-align: center;
    flex-grow: 1;
    display: flex;
    justify-content: center;*/
    position: relative; 
    display: flex;
    height: 100%;
    flex-direction: column;
    flex-grow: 1;
    text-align: center;

`;

function ensureAuth(C, api, needed=true) {
    return (props) => (
        needed ^ api.authenticated
            ? <Redirect to={needed ? "/login" : "/"} />
            : <C routeProps={props}/>
    )
}

const Logout = () => {
    useContext(APIContext).logout();
    return <Redirect to={"/"} />
}

const CTFRouter = ({ location, doAnimations }) => {
    const api = useContext(APIContext);

    const body = <Switch location={location}>
        <Route path="/" exact render={() => <Redirect to={"/home"} />} />

        <Route path="/login" exact render={ensureAuth(Login, api, false)} />
        <Route path="/logout" exact render={ensureAuth(Logout, api)} />
        <Route path="/register" exact render={ensureAuth(SignUp, api, false)} />
        <Route path="/register/email" exact render={ensureAuth(EmailMessage, api, false)} />
        <Route path="/verify" exact render={ensureAuth(EmailVerif, api, false)} />
        <Route path="/team/join" exact render={ensureAuth(JoinTeam, api, true)} />
        <Route path="/team/new" exact render={ensureAuth(CreateTeam, api, true)} />

        <Route path="/home" exact component={HomePage} />
        <Route path="/settings" exact render={ensureAuth(SettingsPage, api, true)} />
        <Route path="/campaign" exact component={Campaign} />

        <Route path="/profile" exact render={() => <Redirect to={"/profile/me"} />} />
        <Route path="/profile/:user" exact render={ensureAuth(Profile, api, true)} />
        <Route path="/users" exact component={UsersList} />
        <Route path="/teams" exact component={TeamsList} />
        <Route path="/team" exact render={ensureAuth(TeamPage, api, true)} />
        <Route path="/leaderboard" exact component={Leaderboard} />

        { Object.keys(plugins.page).map(url =>
            <Route path={url} key={url} exact component={plugins.page[url]} />
        ) }
        <Route component={NotFound} />
    </Switch>;

    return doAnimations ? <Fader>{body}</Fader> : <Container>{body}</Container>;
};

export default withRouter(CTFRouter);
