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

import { registerPlugin } from "ractf";
import { push } from "connected-react-router";

import { EmailVerif, EmailMessage } from "./components/EmailVerif";
import { JoinTeam, CreateTeam } from "./components/Teams";
import PasswordReset from "./components/PasswordReset";
import Welcome from "./components/Welcome";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

import { store } from "store";


export default () => {
    registerPlugin("loginProvider", "basicAuth", {
        component: Login,
    });
    registerPlugin("registrationProvider", "basicAuth", {
        component: SignUp,
    });
    registerPlugin("loginProvider", "basic_auth", {
        component: Login,
    });
    registerPlugin("registrationProvider", "basic_auth", {
        component: SignUp,
    });
    registerPlugin("postLogin", "noteam", () => {
        const { team, config, challenges: { categories } } = store.getState();
        const hasTeams = (config || {}).enable_teams;
        if (team || !hasTeams)
            if (categories.length)
                store.dispatch(push("/campaign"));
            else store.dispatch(push("/"));
        else store.dispatch(push("/welcome"));
    });

    registerPlugin("page", "/welcome", {
        title: "Welcome",
        component: Welcome,
    });
    registerPlugin("page", "/password_reset", {
        title: "Reset Password",
        component: PasswordReset,
    });
    registerPlugin("page", "/verify", {
        title: "Verify",
        component: EmailVerif,
    });
    registerPlugin("page", "/register/email", {
        title: "Register",
        component: EmailMessage,
    });
    registerPlugin("page", "/team/join", {
        title: "Join Team",
        component: JoinTeam,
    });
    registerPlugin("page", "/team/new", {
        title: "New Team",
        component: CreateTeam,
    });
};
