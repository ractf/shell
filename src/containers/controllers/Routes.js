import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styled from "styled-components";

import SettingsPage from "../pages/SettingsPage";
import UsersList from "../pages/UsersList";
import TeamsList from "../pages/TeamsList";
import TeamPage from "../pages/TeamPage";
import HomePage from "../pages/HomePage.js";
import HubPage from "../pages/ChallengeHub.js";
import { NotFound } from "../pages/ErrorPages.js";


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
                        <Route path="/home" exact component={HomePage} />
                        <Route path="/hub" exact component={HubPage} />
                        <Route path="/settings" exact component={SettingsPage} />

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
                        */}
                        <Route component={NotFound} />
                    </Switch>
                </section>
            </CSSTransition>
        </TransitionGroup>
    </Wrapper>;

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
