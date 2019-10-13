import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";

import { APIContext } from "./Contexts";


class APIClass extends Component {
    PROTOCOL = "http:";
    DOMAIN = "//nlaptop.local:8000";
    API_BASE = "";
    BASE_URL = this.PROTOCOL + this.DOMAIN + this.API_BASE;

    ENDPOINTS = {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",

        CHALLENGES: "/challenges/",

        USER_SELF: "/members/self",
        USER: "/members/id/",
    };

    constructor() {
        super();

        let user_data, challenges;
        try {
            user_data = JSON.parse(localStorage.getItem("user_data"));
        } catch(e) {
            user_data = undefined;
        }
        
        try {
            challenges = JSON.parse(localStorage.getItem("challenges"));
        } catch(e) {
            challenges = [];
        }

        this.state = {
            ready: false,
            authenticated: !!user_data,
            user: user_data,
            challenges: challenges,

            login: this.login,
            logout: this.logout,
            register: this.register,

            getCategoryName: this.getCategoryName,
            challengesIn: this.challengesIn,
            getChallenge: this.getChallenge,
        };
    }

    getCategoryName = (category_code) => {
        return "Crypto";
    }

    challengesIn = (category_code) => {
        return this.state.challenges.filter(c => c.category === category_code);
    }

    getChallenge = (category, challenge) => {
        let results = this.state.challenges.filter(c => (
            c.category === category && c.number === challenge
        ));
        if (!results.length) return {};
        return results[0];
    }

    async componentWillMount() {
        let token = localStorage.getItem('token');
        if (token) {
            this.reload_cache();
        } else {
            this.setState({
                ready: true,
            });
        }
    }

    get_headers = () => {
        return {
            Authorization: "Bearer " + localStorage.getItem("token"),
        };
    }

    get_challenges = () => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.CHALLENGES,
                method: "get",
                headers: this.get_headers(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }

    reload_cache = async () => {
        // TODO: This
        let user_data, challenges;
        try {
            user_data = (await this.get_user("self")).d;
        } catch (e) {
            console.error(e);
            return this.logout();
        }

        try {
            challenges = (await this.get_challenges()).d;
        } catch (e) {
            console.error(e);
            return this.logout();
        }

        localStorage.setItem("user_data", JSON.stringify(user_data));
        localStorage.setItem("challenges", JSON.stringify(challenges));

        this.setState({
            ready: true,

            challenges: challenges,
            authenticated: true,
            user: user_data,
        });
    }

    post_login = (username, id, token) => {
        localStorage.setItem("token", token);
        this.reload_cache();

        this.props.history.push("/");
    }

    get_user = (id) => {
        let url = this.BASE_URL;
        if (id === "self")
            url += this.ENDPOINTS.USER_SELF;
        else
            url += this.ENDPOINTS.USER + id;

        return new Promise((resolve, reject) => {
            axios({
                url: url,
                method: "get",
                headers: this.get_headers(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('challenges');
        this.setState({
            authenticated: false,
            user: null,
            ready: true,
            challenges: [],
        })
    }

    login = (username, password, otp=null) => {
        let payload = {username: username, password: password}
        if (otp) payload.otp = otp;

        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.LOGIN,
                method: "post",
                headers: this.get_headers(),
                data: payload
            }).then(response => {
                this.post_login(username, "", response.data.token);
                resolve();
            }).catch(reject);
        });
    };

    register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.REGISTER,
                method: "post",
                headers: this.get_headers(),
                data: { username: username, password: password, email: email }
            }).then(response => {
                this.props.history.push("/register/email");
                resolve();
                return;
            }).catch(reject)
        });
    };

    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export const API = withRouter(APIClass);
