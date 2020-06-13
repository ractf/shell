import * as actions from "actions";
import { push } from "connected-react-router";

import { api, http, plugins } from "ractf";
import { ENDPOINTS } from "./consts";
import { store } from "store";


const _postLogin = async token => {
    store.dispatch(actions.setToken(token));
    await api.reloadAll();

    const post = Object.values(plugins.postLogin);
    for (let i = 0; i < post.length; i++) {
        if (post[i]()) break;
    }
};

export const logout = (wasForced, details) => {
    console.log("%c[Logout]", "color: #d3d", "Logged out user");
    store.dispatch(actions.logout());

    if (wasForced && window.__ractf_alert) {
        details = details ? ("\n\nDetails: " + details) : "";
        window.__ractf_alert("Something went wrong loading the site. You have been logged out.\n" +
            "If this persists, please contact an admin." + details);
    }
};

export const login = (username, password, otp = null) => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.LOGIN, { username, password, otp }).then(data => {
            // Encourage the user to register the URI handler
            if (navigator.registerProtocolHandler) {
                try {
                    navigator.registerProtocolHandler(
                        "web+ractf", window.location.origin + "/uri?%s", "Really Awesome CTF"
                    );
                } catch (e) {
                    console.error("Failed to register web+ractf:", e);
                }
            }
            _postLogin(data.token);
            resolve();
        }).catch(reject);
    });
};

export const add_2fa = () => http.post(ENDPOINTS.ADD_2FA);
export const verify_2fa = (otp) => http.post(ENDPOINTS.VERIFY_2FA, { otp });
export const requestPasswordReset = (email) => http.post(ENDPOINTS.REQUEST_RESET, { email });

export const verify = (uid, token) => {
    try {
        uid = parseInt(uid, 10);
    } catch (e) { };
    return http.post(ENDPOINTS.VERIFY, { uid, token }).then(({ token }) => {
        _postLogin(token);
    });
};

export const completePasswordReset = (id, secret, password) => {
    try {
        id = parseInt(id, 10);
    } catch (e) { }
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.COMPLETE_RESET,
            { uid: id, token: secret, password: password }
        ).then(() => {
            store.dispatch(push("/login"));
            resolve();
        }).catch(reject);
    });
};

export const register = (username, password, email) => {
    return new Promise((resolve, reject) => {
        http.post(ENDPOINTS.REGISTER,
            { username, password, email }
        ).then(() => {
            store.dispatch(push("/register/email"));
            resolve();
        }).catch(reject);
    });
};
