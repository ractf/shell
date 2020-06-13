import { registerPlugin } from "ractf";
import { push } from "connected-react-router";

import { EmailVerif, EmailMessage } from "./components/EmailVerif";
import { JoinTeam, CreateTeam } from "./components/Teams";
import PasswordReset from "./components/PasswordReset";
import NoTeam from "./components/NoTeam";
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
        const { team, challenges: { categories } } = store.getState();
        if (team)
            if (categories.length)
                store.dispatch(push("/campaign"));
            else store.dispatch(push("/"));
        else store.dispatch(push("/noteam"));
    });

    registerPlugin("page", "/noteam", {
        title: "Where next?",
        component: NoTeam,
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
