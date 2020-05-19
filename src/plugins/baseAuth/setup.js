import { registerPlugin } from "ractf";

import { EmailVerif, EmailMessage } from "./components/EmailVerif";
import { JoinTeam, CreateTeam } from "./components/Teams";
import PasswordReset from "./components/PasswordReset";
import NoTeam from "./components/NoTeam";
import SignUp from "./components/SignUp";
import Login from "./components/Login";


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
    registerPlugin("postLogin", "noteam", ({ api, history }) => {
        if (api.team)
            if (api.challenges.length)
                history.push("/campaign");
            else history.push("/");
        else history.push("/noteam");
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
