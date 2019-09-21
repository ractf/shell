import React, { useContext } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";

import ChallengePage, { CampaignChallengePage } from "../pages/ChallengePage";
import { TeamsList, UsersList } from "../pages/Lists";
import { Conduct, Privacy } from "../pages/Conduct";
import SettingsPage from "../pages/SettingsPage";
import { NotFound } from "../pages/ErrorPages";
import Leaderboard from "../pages/Leaderboard";
import { SignUp, LogIn, EmailVerif, JoinTeam, CreateTeam, EmailMessage } from "../pages/SignUp";
import TeamPage from "../pages/TeamPage";
import HomePage from "../pages/HomePage";
import Campaign from "../pages/Campaign";
import Profile from "../pages/Profile";
import About from "../pages/About";
import { APIContext } from "./API";


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

        <Route path="/login" exact render={ensureAuth(LogIn, api, false)} />
        <Route path="/logout" exact render={ensureAuth(Logout, api)} />
        <Route path="/register" exact render={ensureAuth(SignUp, api, false)} />
        <Route path="/register/email" exact render={ensureAuth(EmailMessage, api, false)} />
        <Route path="/verify" exact render={ensureAuth(EmailVerif, api, false)} />
        <Route path="/team/join" exact render={ensureAuth(JoinTeam, api, true)} />
        <Route path="/team/new" exact render={ensureAuth(CreateTeam, api, true)} />

        <Route path="/home" exact component={HomePage} />
        <Route path="/settings" exact render={ensureAuth(SettingsPage, api, true)} />
        <Route path="/campaign" exact component={Campaign} />
        <Route path="/campaign/:challenge" exact component={CampaignChallengePage} />

        <Route path="/profile" exact render={() => <Redirect to={"/profile/me"} />} />
        <Route path="/profile/:user" exact render={ensureAuth(Profile, api, true)} />
        <Route path="/users" exact component={UsersList} />
        <Route path="/teams" exact component={TeamsList} />
        <Route path="/team" exact render={ensureAuth(TeamPage, api, true)} />
        <Route path="/leaderboard" exact component={Leaderboard} />

        <Route path="/conduct" exact component={Conduct} />
        <Route path="/privacy" exact component={Privacy} />

        <Route path="/about" exact component={About} />

        {/*
        <Route path="/login" exact render={checkAuth(Login, api, false)}/>
        <Route path="/register" exact render={checkAuth(Register, api, false)}/>

        <Route path="/new" exact render={checkAuth(NewTwow, api)}/>
        <Route path="/join" exact render={checkAuth(WIP, api)}/>
        <Route path="/browse" exact render={checkAuth(TWOWBrowse, api)}/>
        <Route path="/manage" exact render={checkAuth(BrowseMine, api)}/>
        <Route path="/settings" exact render={checkAuth(ProfileSettings, api)}/>
        <Route path="/me" exact render={checkAuth(MyProfile, api)}/>
        <Route path="/my_plugins" exact render={checkAuth(WIP, api)}/>
        <Route path="/logout" exact render={logout(auth, api)}/>
        */}
        <Route component={NotFound} />
    </Switch>;

    return doAnimations ? <Fader>{body}</Fader> : <Container>{body}</Container>;
};

export default withRouter(CTFRouter);
