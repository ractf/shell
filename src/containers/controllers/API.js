import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";

import { APIContext } from "./Contexts";


class APIClass extends Component {
    PROTOCOL = "http:";
    DOMAIN = "//kylesbank.me:8889";
    API_BASE = "";
    BASE_URL = this.PROTOCOL + this.DOMAIN + this.API_BASE;

    ENDPOINTS = {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ADD_2FA: "/auth/add_2fa",
        VERIFY_2FA: "/auth/verify_2fa",
        VERIFY: "/auth/verify",

        CHALLENGES: "/challenges/",
        FLAG_TEST: "/challenges/<uuid>/attempt",

        USER_SELF: "/members/self",
        USER: "/members/id/",

        TEAM_CREATE: "/teams/create",
        TEAM_JOIN: "/teams/join",
        TEAM_SELF: "/teams/self",
        TEAM: "/teams/",
    };

    constructor() {
        super();

        let userData, challenges, teamData;
        try {
            userData = JSON.parse(localStorage.getItem("userData"));
        } catch(e) {
            userData = undefined;
        }
        
        try {
            challenges = JSON.parse(localStorage.getItem("challenges"));
        } catch(e) {
            challenges = [];
        }
        
        try {
            teamData = JSON.parse(localStorage.getItem("teamData"));
        } catch(e) {
            teamData = {};
        }

        this.state = {
            ready: false,
            authenticated: !!userData,
            user: userData,
            challenges: challenges,
            team: teamData,

            login: this.login,
            logout: this.logout,
            verify: this.verify,
            add_2fa: this.add_2fa,
            register: this.register,
            verify_2fa: this.verify_2fa,
            modifyUser: this.modifyUser,
            createTeam: this.createTeam,
            joinTeam: this.joinTeam,
            attemptFlag: this.attemptFlag,

            getError: this.getError,

            _reloadCache: this._reloadCache,
        };
    }

    async componentWillMount() {
        let token = localStorage.getItem('token');
        if (token) {
            this._reloadCache();
        } else {
            this.setState({
                ready: true,
            });
        }
    }

    getError = e => {
        if (e.response && e.response.data) {
            // We got a response from the server, but it wasn't happy with something
            if (e.response.data.m)
                return e.response.data.m;
            return e.response.data.toString();
        } else if (e.message) {
            // We didn't get a response from the server, but the browser is happy to tell us why
            return e.message;
        }
        // TITSUP!
        return "Unknown error occured.";
    }

    _getHeaders = () => {
        let headers = {};
        if (localStorage.getItem("token"))
            headers.Authorization = localStorage.getItem("token");
        return headers;
    };

    _getChallenges = () => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.CHALLENGES,
                method: "get",
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    _reloadCache = async () => {
        let userData, teamData, challenges, ready = true;
        try {
            userData = (await this.getUser("self")).d;
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
            this.setState({ready: false});
        }

        try {
            teamData = (await this.getTeam("self")).d;
        } catch (e) {
            if (e.request && e.request.status === 404) {
                teamData = null;
            } else {
                if (e.response && e.response.data)
                    return this.logout();
                ready = false;
                this.setState({ready: false});
            }
        }

        try {
            challenges = (await this._getChallenges()).d;
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
        }

        let newState = {ready: ready, authenticated: true};
        if (ready) {
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("teamData", JSON.stringify(teamData));
            localStorage.setItem("challenges", JSON.stringify(challenges));

            newState.user = userData;
            newState.team = teamData;
            newState.challenges = challenges;
        }
        this.setState(newState);
    };

    _postLogin = async token => {
        localStorage.setItem("token", token);
        await this._reloadCache();

        this.props.history.push("/home");
    };

    modifyUser = ({ oPass=null, nPass=null }) => {
        return new Promise((resolve, reject) => {
            reject("Nope.");
        })
    }

    getUser = (id) => {
        let url = this.BASE_URL;
        if (id === "self")
            url += this.ENDPOINTS.USER_SELF;
        else
            url += this.ENDPOINTS.USER + id;

        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "get",
                headers: this._getHeaders()
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    getTeam = (id) => {
        let url = this.BASE_URL;
        if (id === "self")
            url += this.ENDPOINTS.TEAM_SELF;
        else
            url += this.ENDPOINTS.TEAM + id;

        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "get",
                headers: this._getHeaders()
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    createTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.TEAM_CREATE,
                method: "post",
                headers: this._getHeaders(),
                data: {name: name, password: password}
            }).then(async response => {
                let team = (await this.getTeam("self")).d
                this.setState({team: team});
                localStorage.setItem("teamData", team);

                resolve(response.data);
            }).catch(reject);
        });
    };

    joinTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.TEAM_JOIN,
                method: "post",
                headers: this._getHeaders(),
                data: {name: name, password: password}
            }).then(async response => {
                let team = (await this.getTeam("self")).d
                this.setState({team: team});
                localStorage.setItem("teamData", team);

                resolve(response.data);
            }).catch(reject);
        });
    };

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('challenges');
        this.setState({
            authenticated: false,
            user: null,
            ready: true,
            challenges: [],
        })
    };

    login = (username, password, otp=null) => {
        let payload = {username: username, password: password}
        if (otp) payload.otp = otp;

        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.LOGIN,
                method: "post",
                headers: this._getHeaders(),
                data: payload
            }).then(response => {
                this._postLogin(response.data.d.token);
                resolve();
            }).catch(reject);
        });
    };

    add_2fa = () => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.ADD_2FA,
                method: "post",
                headers: this._getHeaders()
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    verify_2fa = (otp) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.VERIFY_2FA,
                method: "post",
                headers: this._getHeaders(),
                data: {otp: otp}
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }

    verify = (uuid) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.VERIFY,
                method: "post",
                headers: this._getHeaders(),
                data: {uuid: uuid}
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }

    register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.REGISTER,
                method: "post",
                headers: this._getHeaders(),
                data: { username: username, password: password, email: email }
            }).then(response => {
                this.props.history.push("/register/email");
                resolve();
                return;
            }).catch(reject)
        });
    };

    attemptFlag = (flag, challenge) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.FLAG_TEST.replace('<uuid>', challenge.uuid),
                method: "post",
                headers: this._getHeaders(),
                data: {flag: flag}
            }).then(resolve).catch(reject);
        });
    };

    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export const API = withRouter(APIClass);
