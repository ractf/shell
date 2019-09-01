import React, { useState, useCallback } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";

import ChallengePage, { CampaignChallengePage } from "../pages/ChallengePage";
import { TeamsList, UsersList } from "../pages/Lists";
import { Conduct, Privacy } from "../pages/Conduct";
import SettingsPage from "../pages/SettingsPage";
import { NotFound } from "../pages/ErrorPages";
import SignUpPage from "../pages/SignUp";
import TeamPage from "../pages/TeamPage";
import HomePage from "../pages/HomePage";
import Campaign from "../pages/Campaign";
import About from "../pages/About";

/*
const CTFRouter = ({ location }) =>
    <Wrapper>
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                timeout={{ enter: 300, exit: 300 }}
                classNames={'fade'}
            >
                <section className="route-section">
                    <Switch location={location}>
                        <Route path="/" exact render={() => <Redirect to={"/home"} />} />

                        <Route path="/register" exact component={SignUpPage} />

                        <Route path="/home" exact component={HomePage} />
                        <Route path="/hub" exact component={HubPage} />
                        <Route path="/category/:category" exact component={CategoryHub} />
                        <Route path="/category/:category/:challenge" exact component={ChallengePage} />
                        <Route path="/settings" exact component={SettingsPage} />
                        <Route path="/campaign" exact component={Campaign} />
                        <Route path="/campaign/:challenge" exact component={CampaignChallengePage} />

                        <Route path="/users" exact component={UsersList} />
                        <Route path="/teams" exact component={TeamsList} />
                        <Route path="/team" exact component={TeamPage} />
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
                        * /}
                        <Route component={NotFound} />
                    </Switch>
                </section>
            </CSSTransition>
        </TransitionGroup>
    </Wrapper>;
*/

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

const CTFRouter = ({ location, doAnimations }) => {
    const body = <Switch location={location}>
        <Route path="/" exact render={() => <Redirect to={"/home"} />} />

        <Route path="/register" exact component={SignUpPage} />

        <Route path="/home" exact component={HomePage} />
        <Route path="/settings" exact component={SettingsPage} />
        <Route path="/campaign" exact component={Campaign} />
        <Route path="/campaign/:challenge" exact component={CampaignChallengePage} />

        <Route path="/users" exact component={UsersList} />
        <Route path="/teams" exact component={TeamsList} />
        <Route path="/team" exact component={TeamPage} />

        <Route path="/conduct" exact component={Conduct} />
        <Route path="/privacy" exact component={Privacy } />

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

const Wrapper = styled.div`
    .fade-enter {
        opacity: 0.01;
    }

    .fade-enter.fade-enter-active {
        opacity: 1;
        transition: opacity 200ms;
    }

    .fade-exit {
        opacity: 1;
    }

    .fade-exit.fade-exit-active {
        opacity: 0.01;
        transition: opacity 200ms;
    }

    section.route-section {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 32px;
        flex-direction: column;
    }
`;

export default withRouter(CTFRouter);
