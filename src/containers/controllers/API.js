import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import axios from "axios";

import WS from "./WS";

import { APIContext } from "./Contexts";


class APIClass extends Component {
    DOMAIN = process.env.REACT_APP_API_DOMAIN;
    API_BASE = process.env.REACT_APP_API_BASE;
    BASE_URL = this.DOMAIN + this.API_BASE;
    ENDPOINTS = {
        COUNTDOWN: "/countdown/",
        CONFIG: "/admin/config",
        ADMIN_CONFIG: "/admin/admin_config",
        USER_LIST_ADMIN: "/admin/members",
        TEAM_LIST_ADMIN: "/admin/teams",
        USER_MODIFY_ADMIN: "/admin/edit_member",
        TEAM_MODIFY_ADMIN: "/admin/edit_team",

        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ADD_2FA: "/auth/add_2fa",
        VERIFY_2FA: "/auth/verify_2fa",
        VERIFY: "/auth/verify",
        REQUEST_RESET: "/auth/request_password_reset",
        COMPLETE_RESET: "/auth/complete_password_reset",

        CHALLENGES: "/challenges/",
        FLAG_TEST: "/challenges/<uuid>/attempt",
        CHALLENGE_CREATE: "/challenges/new",
        CHALLENGE_EDIT: "/challenges/edit",
        CHALLENGE_LINK: "/challenges/link",

        GROUP_CREATE: "/group/new",
        GROUP_EDIT: "/group/edit",

        USER_MODIFY: "/members/mod/",
        USER_SELF: "/members/self",
        USER_LIST: "/members/list",
        USER: "/members/",

        TEAM_CREATE: "/teams/create",
        TEAM_MODIFY: "/teams/mod/",
        TEAM_JOIN: "/teams/join",
        TEAM_SELF: "/teams/self",
        TEAM_LIST: "/teams/list",
        TEAM: "/teams/",

        LEADERBOARD: "/leaderboard/",
    };
    ENSURABLE = {
        allUsers: this.ENDPOINTS.USER_LIST,
        allUsersAdmin: this.ENDPOINTS.USER_LIST_ADMIN,
        allTeams: this.ENDPOINTS.TEAM_LIST,
        allTeamsAdmin: this.ENDPOINTS.TEAM_LIST_ADMIN,
        adminConfig: this.ENDPOINTS.ADMIN_CONFIG,
        leaderboard: this.ENDPOINTS.LEADERBOARD,
    };

    constructor() {
        super();

        let userData, challenges, teamData, countdown, siteOpen, config;
        try {
            userData = JSON.parse(localStorage.getItem("userData"));
        } catch (e) {
            userData = undefined;
        }

        try {
            challenges = JSON.parse(localStorage.getItem("challenges"));
        } catch (e) {
            challenges = [];
        }

        try {
            teamData = JSON.parse(localStorage.getItem("teamData"));
        } catch (e) {
            teamData = {};
        }

        try {
            config = JSON.parse(localStorage.getItem("config"));
        } catch (e) {
            config = {};
        }

        try {
            countdown = JSON.parse(localStorage.getItem("countdown"));

            let ct = new Date(countdown.time);
            let now = new Date();

            siteOpen = (ct - now) - countdown.offset < 0;
        } catch (e) {
            countdown = {};
            siteOpen = false;
        }

        this.state = {
            popups: [],
            hidePopup: this.hidePopup,

            ready: false,
            authenticated: !!userData,
            user: userData,
            challenges: challenges,
            team: teamData,
            config: config,
            setup: this.setup,

            configGet: this.configGet,
            setConfigValue: this.setConfigValue,
            modifyUserAdmin: this.modifyUserAdmin,
            modifyTeamAdmin: this.modifyTeamAdmin,

            allUsers: null,
            allTeams: null,
            allUsersAdmin: null,
            allTeamsAdmin: null,
            adminConfig: null,
            leaderboard: null,

            siteOpen: siteOpen,
            countdown: countdown,
            openSite: this.openSite,

            getCountdown: this.getCountdown,

            getTeam: this.getTeam,
            getUser: this.getUser,

            createChallenge: this.createChallenge,
            linkChallenges: this.linkChallenges,
            editChallenge: this.editChallenge,
            createGroup: this.createGroup,
            editGroup: this.editGroup,

            login: this.login,
            logout: this.logout,
            verify: this.verify,
            add_2fa: this.add_2fa,
            register: this.register,
            verify_2fa: this.verify_2fa,
            requestPasswordReset: this.requestPasswordReset,
            completePasswordReset: this.completePasswordReset,

            modifyUser: this.modifyUser,
            createTeam: this.createTeam,

            modifyTeam: this.modifyTeam,
            joinTeam: this.joinTeam,

            attemptFlag: this.attemptFlag,

            ensure: this.ensure,
            getError: this.getError,

            _reloadCache: this._reloadCache,
        };

        this.ws = new WS(this);
    }

    async componentWillMount() {
        this.setup();
        this._setupConfig();
    }
    async _setupConfig() {
        let config;
        try {
            config = (await this._getConfig()).d;
        } catch (e) {
            return
        }

        localStorage.setItem("config", JSON.stringify(config));
        this.setState({ config: config });
    }
    async setup() {
        let token = localStorage.getItem('token');
        if (token) {
            this._reloadCache();
        } else {
            this.setState({
                ready: true,
            });
        }

        //if (!this.state.siteOpen) return;
    }

    // Helpers
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
    };

    get = url => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + url,
                method: "get",
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    post = (url, data) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + url,
                method: "post",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    _getHeaders = () => {
        let headers = {};
        if (localStorage.getItem("token"))
            headers.Authorization = localStorage.getItem("token");
        return headers;
    };

    _reloadCache = async () => {
        let userData, teamData, challenges, ready = true;
        try {
            userData = (await this.getUser("self")).d;
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
            this.setState({ ready: false });
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
                this.setState({ ready: false });
            }
        }

        try {
            challenges = (await this._getChallenges()).d;
            this._createChallengeLinks(challenges);
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
        }

        let newState = { ready: ready, authenticated: true };
        if (ready) {
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("teamData", JSON.stringify(teamData));
            localStorage.setItem("challenges", JSON.stringify(challenges));

            newState.user = userData;
            newState.team = teamData;
            newState.challenges = challenges;
            newState.siteOpen = true;
        }
        this.setState(newState);
    };

    // Misc
    _createChallengeLinks = (challenges) => {
        const NORTH = 1, WEST = 2, SOUTH = 4, EAST = 8;

        challenges.forEach(group => {
            if (group.type === "campaign") {
                let challenges = {};
                group.chals.forEach(
                    i => {
                        challenges[i.id] = i;
                        i.link = 0;
                    }
                );
                group.chals.forEach(
                    i => {
                        i.deps.forEach(dep => {
                            if (challenges[dep]) {
                                let depChallenge = challenges[dep];
                                if (depChallenge.metadata.x === i.metadata.x + 1 && depChallenge.metadata.y === i.metadata.y) {
                                    i.link |= EAST;
                                    depChallenge.link |= WEST;
                                }
                                if (depChallenge.metadata.x === i.metadata.x - 1 && depChallenge.metadata.y === i.metadata.y) {
                                    i.link |= WEST;
                                    depChallenge.link |= EAST;
                                }
                                if (depChallenge.metadata.x === i.metadata.x && depChallenge.metadata.y === i.metadata.y - 1) {
                                    i.link |= NORTH;
                                    depChallenge.link |= SOUTH;
                                }
                                if (depChallenge.metadata.x === i.metadata.x && depChallenge.metadata.y === i.metadata.y + 1) {
                                    i.link |= SOUTH;
                                    depChallenge.link |= NORTH;
                                }
                            }
                        });
                    }
                )
            }
        })
    };

    getUUID = () => {
        if (window.crypto)
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & ((15 >> c) / 4))).toString(16)
            );
        else
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0;
                return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
            });
    };

    addPopup = (title, body) => {
        let id = this.getUUID();
        this.setState({ popups: [...this.state.popups, { title: title, body: body, id: id }] })
        setTimeout(() => {
            this.hidePopup(id);
        }, 10000);
    };

    hidePopup = (id) => {
        this.setState({ popups: this.state.popups.filter(i => i.id !== id) })
    };

    // Endpoint Things
    ensure = async type => {
        return this.get(this.ENSURABLE[type]).then(data => {
            this.setState({ [type]: data.d });
            return data;
        });
    };

    configGet = (key, fallback) => {
        if (this.state.config && this.state.config.hasOwnProperty(key))
            return this.state.config[key];
        return fallback;
    };

    openSite = () => {
        this.setState({ ready: false, siteOpen: true });
        this.setup();
    };

    getCountdown = () => this.get(this.ENDPOINTS.COUNTDOWN).then(data => {
        if (data.s) {
            let ct = new Date(data.d.countdown_timestamp);
            let st = new Date(data.d.server_timestamp);
            let now = new Date();

            let countdown = { time: data.d.countdown_timestamp, offset: st - now };
            localStorage.setItem("countdown", JSON.stringify(countdown));

            if (ct - st < 0) this.setState({ countdown: countdown, siteOpen: true });
            else this.setState({ countdown: countdown, siteOpen: false, ready: true });
        }
    });
    _getConfig = () => this.get(this.ENDPOINTS.CONFIG);
    _getAdminConfig = () => this.get(this.ENDPOINTS.ADMIN_CONFIG);
    _getChallenges = () => this.get(this.ENDPOINTS.CHALLENGES);
    setConfigValue = (key, value) => this.post(this.ENDPOINTS.ADMIN_CONFIG, { key: key, value: value });

    _postLogin = async token => {
        localStorage.setItem("token", token);
        await this._reloadCache();

        if (this.state.team)
            this.props.history.push("/home");
        else
            this.props.history.push("/noteam");
    };

    modifyUser = (userId, data) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.USER_MODIFY + userId,
                method: "patch",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };
    modifyUserAdmin = (id, data) => this.post(this.ENDPOINTS.USER_MODIFY_ADMIN, { id: id, ...data });
    modifyTeamAdmin = (id, data) => this.post(this.ENDPOINTS.TEAM_MODIFY_ADMIN, { id: id, ...data });

    getUser = (id) => {
        return this.get(id === "self" || id === "me" ? this.ENDPOINTS.USER_SELF : this.ENDPOINTS.USER + id);
    };

    getTeam = (id) => {
        return this.get(id === "self" || id === "me" ? this.ENDPOINTS.TEAM_SELF : this.ENDPOINTS.TEAM + id);
    };

    modifyTeam = (teamId, data) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.TEAM_MODIFY + teamId,
                method: "patch",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    createTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            this.post(this.ENDPOINTS.TEAM_CREATE, { name: name, password: password }
            ).then(async data => {
                let team = (await this.getTeam("self")).d
                this.setState({ team: team });
                localStorage.setItem("teamData", team);

                resolve(data);
            }).catch(reject);
        });
    };

    joinTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            this.post(this.ENDPOINTS.TEAM_JOIN, { name: name, password: password }
            ).then(async data => {
                let team = (await this.getTeam("self")).d
                this.setState({ team: team });
                localStorage.setItem("teamData", team);

                resolve(data);
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

    login = (username, password, otp = null) => {
        let payload = { username: username, password: password }
        if (otp) payload.otp = otp;

        return new Promise((resolve, reject) => {
            this.post(this.ENDPOINTS.LOGIN, payload
            ).then(data => {
                this._postLogin(data.d.token);
                resolve();
            }).catch(reject);
        });
    };

    add_2fa = () => this.post(this.ENDPOINTS.ADD_2FA);
    verify_2fa = (otp) => this.post(this.ENDPOINTS.VERIFY_2FA, { otp: otp });
    requestPasswordReset = (email) => this.post(this.ENDPOINTS.REQUEST_RESET, { username: email });
    verify = (uuid) => this.post(this.ENDPOINTS.VERIFY, { uuid: uuid }).then(data => {
        this._postLogin(data.d.token);
    });
    createGroup = (name, desc, type) => this.post(this.ENDPOINTS.GROUP_CREATE, { name: name, desc: desc, type: type });
    editGroup = (id, name, desc, type) => this.post(this.ENDPOINTS.GROUP_EDIT, { id: id, name: name, desc: desc, type: type });
    editChallenge = (id, name, points, desc, flag_type, flag, autoUnlock, meta) =>
        this.post(this.ENDPOINTS.CHALLENGE_EDIT, { id: id, name: name, points: points, desc: desc, flag_type: flag_type, flag: flag, auto_unlock: autoUnlock, meta: meta });
    createChallenge = (group, name, points, desc, flag_type, flag, autoUnlock, meta) =>
        this.post(this.ENDPOINTS.CHALLENGE_CREATE, { group: group, name: name, points: points, desc: desc, flag_type: flag_type, flag: flag, auto_unlock: autoUnlock, meta: meta });
    linkChallenges = (chal1, chal2, linkState) =>
        this.post(this.ENDPOINTS.CHALLENGE_LINK, {cfrom: chal1.id, cto: chal2.id, state: linkState});

    completePasswordReset = (id, secret, password) => {
        return new Promise((resolve, reject) => {
            this.post(this.ENDPOINTS.COMPLETE_RESET,
                { uuid: id, secret: secret, new_password: password }
            ).then(response => {
                this.props.history.push("/login");
                resolve();
            }).catch(reject)
        });
    };

    register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            this.post(this.ENDPOINTS.REGISTER,
                { username: username, password: password, email: email }
            ).then(response => {
                this.props.history.push("/register/email");
                resolve();
            }).catch(reject)
        });
    };

    attemptFlag = (flag, challenge) => this.post(
        this.ENDPOINTS.FLAG_TEST.replace('<uuid>', challenge.id),
        { flag: flag }
    );

    // React
    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export const API = withRouter(APIClass);
