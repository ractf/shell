import { withRouter } from "react-router-dom";
import React, { Component, useState } from "react";
import axios from "axios";

import WS from "./WS";

import { APIContext, APIEndpoints } from "./Contexts";


export const DOMAIN = process.env.REACT_APP_API_DOMAIN;
export const API_BASE = process.env.REACT_APP_API_BASE;
export const BASE_URL = DOMAIN + API_BASE;
export const ENDPOINTS = {
    COUNTDOWN: "/stats/countdown",
    CONFIG: "/config/",

    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ADD_2FA: "/auth/add_2fa",
    VERIFY_2FA: "/auth/verify_2fa",
    VERIFY: "/auth/verify_email",
    REQUEST_RESET: "/auth/request_password_reset",
    COMPLETE_RESET: "/auth/password_reset",

    CATEGORIES: "/challenges/categories/",
    CHALLENGES: "/challenges/",
    SUBMIT_FLAG: "/challenges/submit_flag/",

    EDIT_FILE: "/files/edit",
    NEW_FILE: "/files/new",
    EDIT_HINT: "/hints/edit",
    NEW_HINT: "/hints/new",
    USE_HINT: "/hints/use",

    USER: "/member/",
    TEAM: "/team/",

    TEAM_CREATE: "/team/create",
    TEAM_JOIN: "/team/join",

    LEADERBOARD: "/leaderboard/",

    STATS: "/stats/stats",
    VERSION: "/stats/version",
};


class APIClass extends Component {

    constructor(props) {
        super(props);

        this._cache = {};
        try {
            this._cache = JSON.parse(localStorage.getItem("apiCache")) || {};
        } catch (e) { };

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

        this.endpoints = {
            setup: this.setup,
            hidePopup: this.hidePopup,

            configGet: this.configGet,
            setConfigValue: this.setConfigValue,
            openSite: this.openSite,

            getCountdown: this.getCountdown,

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

            editFile: this.editFile,
            newFile: this.newFile,
            editHint: this.editHint,
            newHint: this.newHint,
            useHint: this.useHint,

            getError: this.getError,

            runCode: this.runCode,
            abortRunCode: this.abortRunCode,

            _reloadCache: this._reloadCache,
            getCache: this.getCache,
            cachedGet: this.cachedGet,
            get: this.get,
        };
        this.state = {
            popups: [],

            ready: false,
            authenticated: !!userData,
            user: userData,
            challenges: challenges,
            team: teamData,
            config: config,

            codeRunState: { running: false },

            siteOpen: siteOpen,
            countdown: countdown,

        };

        window.__ractf_api = this;
    }

    async componentDidMount() {
        this.setup();
        this._setupConfig();
    }
    async _setupConfig() {
        let config;
        try {
            config = (await this._getConfig());
        } catch (e) {
            console.error("Error loading config:", e);
            return;
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
    getCache = route => {
        return this._cache[route];
    };

    cachedGet = route => {
        // Ensure we always have a trailing slash
        if (!(/.*(\/|stats)$/.test(route))) route = route + "/";

        return this.get(route).then(data => data.d).then(data => {
            this._cache[route] = data;
            localStorage.setItem("apiCache", JSON.stringify(this._cache));
            return data;
        });
    };

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
        return "Unknown error occurred.";
    };

    get = url => {
        return new Promise((resolve, reject) => {
            axios({
                url: BASE_URL + url,
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
                url: BASE_URL + url,
                method: "post",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    patch = (url, data) => {
        return new Promise((resolve, reject) => {
            axios({
                url: BASE_URL + url,
                method: "patch",
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
            headers.Authorization = 'Token ' + localStorage.getItem("token");
        return headers;
    };

    _reloadCache = async () => {
        let userData, teamData, challenges, ready = true;
        try {
            userData = await this.cachedGet(ENDPOINTS.USER + "self/");
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
            this.setState({ ready: false });
        }

        if (userData && userData.team !== null) {
            try {
                teamData = await this.cachedGet(ENDPOINTS.TEAM + "self/");
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
        } else teamData = null;

        try {
            challenges = (await this._getChallenges()).d;
            //this._createChallengeLinks(challenges);
        } catch (e) {
            if (e.response && e.response.data)
                return this.logout();
            ready = false;
        }

        let newState = { ready: ready, authenticated: ready };
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
    /*
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
                group.chals.forEach(i => {
                    i.deps && i.deps.forEach(dep => {
                        if (challenges[dep]) {
                            let depChallenge = challenges[dep];
                            if (depChallenge.challenge_metadata.x === i.challenge_metadata.x + 1 &&
                                depChallenge.challenge_metadata.y === i.challenge_metadata.y) {
                                i.link |= EAST;
                                depChallenge.link |= WEST;
                            }
                            if (depChallenge.challenge_metadata.x === i.challenge_metadata.x - 1 &&
                                depChallenge.challenge_metadata.y === i.challenge_metadata.y) {
                                i.link |= WEST;
                                depChallenge.link |= EAST;
                            }
                            if (depChallenge.challenge_metadata.x === i.challenge_metadata.x &&
                                depChallenge.challenge_metadata.y === i.challenge_metadata.y - 1) {
                                i.link |= NORTH;
                                depChallenge.link |= SOUTH;
                            }
                            if (depChallenge.challenge_metadata.x === i.challenge_metadata.x &&
                                depChallenge.challenge_metadata.y === i.challenge_metadata.y + 1) {
                                i.link |= SOUTH;
                                depChallenge.link |= NORTH;
                            }
                        }
                    });
                });
            }
        });
    };
    */

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
        this.setState({ popups: [...this.state.popups, { title: title, body: body, id: id }] });
        setTimeout(() => {
            this.hidePopup(id);
        }, 10000);
    };

    hidePopup = (id) => {
        this.setState({ popups: this.state.popups.filter(i => i.id !== id) });
    };

    // Endpoint Things
    configGet = (key, fallback) => {
        if (this.state.config && this.state.config.hasOwnProperty(key))
            return this.state.config[key];
        return fallback;
    };

    openSite = () => {
        this.setState({ ready: false, siteOpen: true });
        this.setup();
    };

    getCountdown = () => this.get(ENDPOINTS.COUNTDOWN).then(data => {
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
    _getConfig = () => this.get(ENDPOINTS.CONFIG).then(({ d }) => {
        let config = {};
        d.forEach(({ key, value}) => config[key] = value.value);
        return config;
    });
    _getChallenges = () => this.get(ENDPOINTS.CATEGORIES);
    setConfigValue = (key, value) => this.patch(ENDPOINTS.CONFIG + key + "/", { value: {value: value} });

    _postLogin = async token => {
        localStorage.setItem("token", token);
        await this._reloadCache();

        if (this.state.team)
            this.props.history.push("/home");
        else
            this.props.history.push("/noteam");
    };

    modifyUser = (userId, data) => this.patch(BASE_URL + ENDPOINTS.USER + userId + "/", data);
    modifyTeam = (teamId, data) => this.patch(BASE_URL + ENDPOINTS.TEAM + teamId + "/", data);

    createTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.TEAM_CREATE, { name, password }
            ).then(async data => {
                let team = await this.cachedGet("/team/self");
                this.setState({ team: team });
                localStorage.setItem("teamData", team);

                resolve(data);
            }).catch(reject);
        });
    };

    joinTeam = (name, password) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.TEAM_JOIN, { name, password }
            ).then(async data => {
                let team = await this.cachedGet("/team/self");
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
        });
    };

    login = (username, password, otp = null) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.LOGIN, { username, password, otp }
            ).then(data => {
                this._postLogin(data.d.token);
                resolve();
            }).catch(reject);
        });
    };

    add_2fa = () => this.post(ENDPOINTS.ADD_2FA);
    verify_2fa = (otp) => this.post(ENDPOINTS.VERIFY_2FA, { otp });
    requestPasswordReset = (email) => this.post(ENDPOINTS.REQUEST_RESET, { email });
    verify = (uid, token) => this.post(ENDPOINTS.VERIFY, { uid, token }).then(data => {
        this._postLogin(data.d.token);
    });
    createGroup = (name, desc, type) => (
        this.post(ENDPOINTS.CATEGORIES, { name, metadata: null, description: desc, contained_type: type })
    );
    editGroup = (id, name, desc, type) => (
        this.post(ENDPOINTS.CATEGORIES, { id, name, desc, type })
    );

    editChallenge = ({
        id, name, score, description, flag_type, flag_metadata, autoUnlock,
        challenge_metadata, author, challenge_type, unlocks, files
    }) => (
        this.patch(ENDPOINTS.CHALLENGES + "/" + id + "/", {
            name, score, description,
            flag_type, flag_metadata,
            challenge_metadata,
            author, unlocks, files,
            challenge_type: challenge_type || "default",
            auto_unlock: autoUnlock,
        })
    );
    createChallenge = ({
        id, name, score, description, flag_type, flag_metadata, autoUnlock,
        challenge_metadata, author, challenge_type, unlocks, files
    }) => (
        this.post(ENDPOINTS.CHALLENGES, {
            category: id, name, score, description,
            flag_type, flag_metadata,
            challenge_metadata,
            author, unlocks, files,
            challenge_type: challenge_type || "default",
            auto_unlock: autoUnlock,
        })
    );

    linkChallenges = (chal1, chal2, linkState) => {
        if (linkState) {
            chal1.unlocks.push(chal2.id);
            chal2.unlocks.push(chal1.id);
        } else {
            chal1.unlocks = chal1.unlocks.filter(i => i !== chal2.id);
            chal2.unlocks = chal2.unlocks.filter(i => i !== chal1.id);
        }
        this.patch(ENDPOINTS.CHALLENGES + "/" + chal1.id + "/", { unlocks: chal1.unlocks });
        this.patch(ENDPOINTS.CHALLENGES + "/" + chal2.id + "/", { unlocks: chal2.unlocks });
    }

    completePasswordReset = (id, secret, password) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.COMPLETE_RESET,
                { uid: id, token: secret, password: password }
            ).then(response => {
                this.props.history.push("/login");
                resolve();
            }).catch(reject);
        });
    };

    register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.REGISTER,
                { username, password, email }
            ).then(response => {
                this.props.history.push("/register/email");
                resolve();
            }).catch(reject);
        });
    };

    attemptFlag = (flag, challenge) => this.post(
        ENDPOINTS.SUBMIT_FLAG, { challenge: challenge.id, flag: flag }
    );

    editFile = (id, name, url, size) =>
        this.post(ENDPOINTS.EDIT_FILE, { id, name, url, size }).then(() => {
            this.state.challenges.forEach(group =>
                group.chals.forEach(chal =>
                    chal.files.forEach(file => {
                        if (file.id === id) {
                            file.name = name;
                            file.url = url;
                            file.size = size;
                        }
                    })
                )
            );
            this.setState({ challenges: this.state.challenges });
        });
    newFile = (chalId, name, url, size) =>
        this.post(ENDPOINTS.NEW_FILE, { chal_id: chalId, name, url, size }).then((resp) => {
            this.state.challenges.forEach(group =>
                group.chals.forEach(chal => {
                    if (chal.id === chalId) {
                        chal.files.push(resp.d);
                    }
                })
            );
            this.setState({ challenges: this.state.challenges });
        });

    editHint = (id, name, cost, body) =>
        this.post(ENDPOINTS.EDIT_HINT, { id, name, cost, body }).then(() => {
            this.state.challenges.forEach(group =>
                group.chals.forEach(chal =>
                    chal.hints.forEach(hint => {
                        if (hint.id === id) {
                            hint.name = name;
                            hint.cost = cost;
                            hint.body = body;
                        }
                    })
                )
            );
            this.setState({ challenges: this.state.challenges });
        });
    newHint = (chalId, name, cost, body) =>
        this.post(ENDPOINTS.NEW_HINT, { chal_id: chalId, name, cost, body }).then((resp) => {
            this.state.challenges.forEach(group =>
                group.chals.forEach(chal => {
                    if (chal.id === chalId) {
                        chal.hints.push(resp.d);
                    }
                })
            );
            this.setState({ challenges: this.state.challenges });
        });
    useHint = (id) =>
        this.post(ENDPOINTS.USE_HINT, { id }).then(resp => resp.d).then(body => {
            this.state.challenges.forEach(group =>
                group.chals.forEach(chal =>
                    chal.hints.forEach(hint => {
                        if (hint.id === id) {
                            hint.body = body;
                            hint.hint_used = true;
                        }
                    })
                )
            );
            this.setState({ challenges: this.state.challenges });
            return body;
        });


    runCode = (runType, fileName, fileContent) => {
        if (this.state.codeRunState.running) return;

        this.post(ENDPOINTS.RUN_CODE + "/" + runType, { exec: btoa(fileContent) }).then(resp => {
            //
        }).catch(e => {
            this.setState({
                codeRunState: {
                    running: false,
                    error: this.getError(e),
                }
            });
        });
        this.setState({
            codeRunState: {
                name: fileName,
                running: true,
                start: new Date(),
            }
        });
    };
    abortRunCode = () => {
        this.setState({ codeRunState: { running: false } });
    };

    // React
    render() {
        return <APIContext.Provider value={this.state}>
            <APIEndpoints.Provider value={this.endpoints}>
                {/*<WS api={this} />*/}
                {this.props.children}
            </APIEndpoints.Provider>
        </APIContext.Provider>;
    };
}

export const API = withRouter(APIClass);
