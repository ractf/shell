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

        CHALLENGES: "/challenges/",

        USER_SELF: "/members/self",
        USER: "/members/id/",
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

        teamData = {
            name: "PWN to 0xE4",
            members: [
                {name: "Bottersnike", isCaptain: true},
                {name: "Sai", isCaptain: false},
                {name: "Beano", isCaptain: false},
                {name: "<b>Lol</b>", isCaptain: false},
            ],
            isOwner: true,
        };

        this.state = {
            ready: false,
            authenticated: !!userData,
            user: userData,
            challenges: challenges,
            team: teamData,

            login: this.login,
            logout: this.logout,
            register: this.register,
            modifyUser: this.modifyUser,
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
        // TODO: This
        let userData, challenges;
        try {
            userData = (await this.getUser("self")).d;
        } catch (e) {
            console.error(e);
            return this.logout();
        }

        try {
            challenges = (await this._getChallenges()).d;
        } catch (e) {
            console.error(e);
            return this.logout();
        }

        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("challenges", JSON.stringify(challenges));

        this.setState({
            ready: true,

            challenges: challenges,
            authenticated: true,
            user: userData,
        });
    };

    _postLogin = async (username, id, token) => {
        localStorage.setItem("token", token);
        await this._reloadCache();

        this.props.history.push("/");
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
                headers: this._getHeaders(),
            }).then(response => {
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
                this._postLogin(username, "", response.data.d.token);
                resolve();
            }).catch(reject);
        });
    };

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

    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export const API = withRouter(APIClass);
