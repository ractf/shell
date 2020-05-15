import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";

import WS from "./WS";

import { APIContext, APIEndpoints } from "./Contexts";

import { plugins } from "ractf";


export const DOMAIN = process.env.REACT_APP_API_DOMAIN;
export const API_BASE = process.env.REACT_APP_API_BASE;
export const BASE_URL = DOMAIN + API_BASE;
export const ENDPOINTS = {
    COUNTDOWN: "/stats/countdown/",
    CONFIG: "/config/",
    ANNOUNCEMENTS: "/announcements/",

    REGISTER: "/auth/register/",
    LOGIN: "/auth/login/",
    ADD_2FA: "/auth/add_2fa/",
    VERIFY_2FA: "/auth/verify_2fa/",
    VERIFY: "/auth/verify_email/",
    REQUEST_RESET: "/auth/request_password_reset/",
    COMPLETE_RESET: "/auth/password_reset/",

    CATEGORIES: "/challenges/categories/",
    CHALLENGES: "/challenges/",
    SUBMIT_FLAG: "/challenges/submit_flag/",

    FILE: "/challenges/files/",
    HINT: "/hints/",
    USE_HINT: "/hints/use/",

    USER: "/member/",
    TEAM: "/team/",

    TEAM_CREATE: "/team/create/",
    TEAM_JOIN: "/team/join/",

    LEADERBOARD_GRAPH: "/leaderboard/graph/",
    LEADERBOARD_USER: "/leaderboard/user/",
    LEADERBOARD_TEAM: "/leaderboard/team/",

    STATS: "/stats/stats/",
    VERSION: "/stats/version/",
};


class APIClass extends Component {
    constructor(props) {
        super(props);

        this._cache = {};
        try {
            this._cache = JSON.parse(localStorage.getItem("apiCache")) || {};
        } catch (e) { };

        let userData, challenges, teamData, countdown, config;
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
            countdown = this.recheckCountdowns(countdown);
        } catch (e) {
            countdown = { dates: {}, passed: {} };
        }

        this._loginCallback = null;

        this.endpoints = {
            setup: this.setup,
            hidePopup: this.hidePopup,

            configGet: this.configGet,
            setConfigValue: this.setConfigValue,

            getCountdown: this.getCountdown,
            addAnnouncement: this.addAnnouncement,
            hideAnnouncement: this.hideAnnouncement,
            removeAnnouncement: this.removeAnnouncement,

            createChallenge: this.createChallenge,
            removeChallenge: this.removeChallenge,
            linkChallenges: this.linkChallenges,
            editChallenge: this.editChallenge,
            createGroup: this.createGroup,
            removeGroup: this.removeGroup,
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
            removeFile: this.removeFile,
            editHint: this.editHint,
            newHint: this.newHint,
            useHint: this.useHint,
            removeHint: this.removeHint,

            getError: this.getError,

            runCode: this.runCode,
            abortRunCode: this.abortRunCode,

            _reloadCache: this._reloadCache,
            getCache: this.getCache,
            cachedGet: this.cachedGet,
            abortableGet: this.abortableGet,
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
            announcements: [],

            countdown: countdown,
            recheckCountdowns: this.recheckCountdowns,
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
    async setup(minimal) {
        let token = localStorage.getItem('token');
        if (token) {
            this._reloadCache(minimal).then((newState) => {
                if (newState && newState.authenticated && newState.ready && this._getAnnouncements)
                    this._getAnnouncements();
            });
        } else {
            this.setState({
                ready: true,
            });
        }
    }

    // Helpers
    getCache = route => {
        return this._cache[route];
    };

    appendSlash = url => {
        // Split the url and the query string
        let [base, query] = /^([^?]*?)(\?.*)?$/.exec(url).slice(1);
        // Ensure we always have a trailing slash
        if (!(/.*\/$/.test(base))) base = base + "/";
        return base + (query || "");
    }

    cachedGet = route => {
        return this.get(route).then(data => data.d).then(data => {
            this._cache[route] = data;
            localStorage.setItem("apiCache", JSON.stringify(this._cache));
            return data;
        });
    };

    getError = e => {
        if (e.response && e.response.data) {
            // We got a response from the server, but it wasn't happy with something
            if (e.response.data.m) {
                let error = e.response.data.m;
                let translated = this.props.t("api." + error);
                if (translated !== error && (typeof translated) !== "object") error = translated;

                switch (typeof e.response.data.d) {
                    case "string":
                        if (e.response.data.d.length > 0)
                            error += "\n" + e.response.data.d;
                        break;
                    case "object":
                        if (e.response.status === 400) error = "";
                        let extra = "";
                        Object.keys(e.response.data.d).forEach(i => {
                            if (i === "reason") return;
                            if (extra.length !== 0) extra += "\n";
                            extra += e.response.data.d[i];
                        });
                        if (e.response.status === 400 && extra.length !== 0) error = extra;
                        else error += "\n" + extra;
                        break;
                    default:
                        break;
                }

                return error;
            }
            return e.response.data.toString();
        } else if (e.message) {
            // We didn't get a response from the server, but the browser is happy to tell us why
            return e.message;
        }
        // TITSUP!
        return "Unknown error occurred.";
    };

    abortableGet = (url) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        return [new Promise((resolve, reject) => {
            axios({
                url: this.appendSlash(BASE_URL + url),
                cancelToken: source.token,
                method: "get",
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data.d);
            }).catch(reject);
        }), source.cancel];
    };

    get = url => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.appendSlash(BASE_URL + url),
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
                url: this.appendSlash(BASE_URL + url),
                method: "post",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    put = (url, data) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.appendSlash(BASE_URL + url),
                method: "put",
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
                url: this.appendSlash(BASE_URL + url),
                method: "patch",
                data: data,
                headers: this._getHeaders(),
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    };

    delete = (url) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.appendSlash(BASE_URL + url),
                method: "delete",
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

    _reloadCache = async (minimal) => {
        let userData, teamData, challenges, ready = true;
        if (!minimal) {
            try {
                userData = await this.cachedGet(ENDPOINTS.USER + "self");
            } catch (e) {
                if (e.response && e.response.data)
                    return this.logout(true, this.getError(e));
                ready = false;
                this.setState({ ready: false });
            }

            if (userData && userData.team !== null) {
                try {
                    teamData = await this.cachedGet(ENDPOINTS.TEAM + "self");
                } catch (e) {
                    if (e.request && e.request.status === 404) {
                        teamData = null;
                    } else {
                        if (e.response && e.response.data)
                            return this.logout(true, this.getError(e));
                        ready = false;
                        this.setState({ ready: false });
                    }
                }
            } else teamData = null;
        }

        try {
            challenges = (await this._getChallenges()).d;
        } catch (e) {
            challenges = [];
        }

        let newState = { ready: ready, authenticated: ready };
        if (ready) {
            if (!minimal) {
                localStorage.setItem("userData", JSON.stringify(userData));
                localStorage.setItem("teamData", JSON.stringify(teamData));
            }
            localStorage.setItem("challenges", JSON.stringify(challenges));

            if (!minimal) {
                newState.user = userData;
                newState.team = teamData;
            }
            newState.challenges = challenges;
        }
        this.setState(newState);
        return newState;
    };

    // Misc
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
    showAnnouncement = (data) => {
        let shown;
        try {
            shown = JSON.parse(localStorage.getItem("announce")) || [];
        } catch (e) {
            shown = [];
        }
        if (shown.indexOf(data.id) !== -1)
            return;
        this.setState(state => ({
            announcements: [...state.announcements, data]
        }));
    };
    hideAnnouncement = ({ id }) => {
        let shown;
        try {
            shown = JSON.parse(localStorage.getItem("announce")) || [];
        } catch (e) {
            shown = [];
        }
        if (shown.indexOf(id) === -1)
            shown.push(id);
        localStorage.setItem("announce", JSON.stringify(shown));
        this.setState(state => ({
            announcements: state.announcements.filter(i => i.id !== id)
        }));
    };
    removeAnnouncement = ({ id }) => this.delete(ENDPOINTS.ANNOUNCEMENTS + id);

    hidePopup = (id) => {
        this.setState({ popups: this.state.popups.filter(i => i.id !== id) });
    };

    // Endpoint Things
    configGet = (key, fallback) => {
        if (this.state.config && this.state.config.hasOwnProperty(key))
            return this.state.config[key];
        return fallback;
    };

    recheckCountdowns = (old) => {
        let countdown = {
            ...(old || this.state.countdown),
            passed: {},
        };
        // This double negative is intentional.
        // If "+" is used, JS concatinates the int to the date as a string.
        let now = (new Date()) - (-countdown.offset);
        let changed = false;
        Object.entries(countdown.dates).forEach(([key, value]) => {
            countdown.passed[key] = value - now < 0;
            if (countdown.passed[key] !== this.state.countdown.passed[key])
                changed = true;
        });
        if (old) return countdown;
        if (changed) this._reloadCache();
        this.setState({ countdown: countdown });
    }

    getCountdown = () => this.get(ENDPOINTS.COUNTDOWN).then(data => {
        if (data.s) {
            let serverTime = new Date(data.d.server_timestamp);
            let offset = serverTime - (new Date());

            let countdown = {
                offset: offset,
                dates: {},
                passed: {},
            };
            Object.entries(data.d).forEach(([key, value]) => {
                if (key === "server_timestamp") return;
                countdown.dates[key] = new Date(value * 1000) - offset;
                countdown.passed[key] = countdown.dates[key] - serverTime < 0;
            });

            //let ct = new Date(data.d.countdown_timestamp * 1000);

            //let countdown = { time: ct, offset: st - now };
            localStorage.setItem("countdown", JSON.stringify(countdown));

            this.setState({ countdown: countdown });
        }
    });
    _getAnnouncements = () => {
        this.get(ENDPOINTS.ANNOUNCEMENTS).then(({ d }) => {
            d.forEach(i => this.showAnnouncement(i));
        }).catch(() => { });
    }
    addAnnouncement = (title, body) => this.post(ENDPOINTS.ANNOUNCEMENTS, { title, body });
    _getConfig = () => this.get(ENDPOINTS.CONFIG).then(({ d }) => {
        let config = {};
        Object.entries(d).forEach(([key, value]) => config[key] = value);
        return config;
    });
    _getChallenges = () => this.get(ENDPOINTS.CATEGORIES);
    setConfigValue = (key, value) => this.post(ENDPOINTS.CONFIG + key, { value });

    _postLogin = async token => {
        localStorage.setItem("token", token);
        if (this._loginCallback) this._loginCallback(token);
        await this._reloadCache();

        let post = Object.values(plugins.postLogin);
        for (let i = 0; i < post.length; i++) {
            if (post[i]({
                ...this.props, api: this.state
            })) break;
        }
    };

    modifyUser = (userId, data) => this.patch(BASE_URL + ENDPOINTS.USER + userId, data);
    modifyTeam = (teamId, data) => this.patch(BASE_URL + ENDPOINTS.TEAM + teamId, data);

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

    logout = (wasForced, details) => {
        console.log("%c[Logout]", "color: #d3d", "Logged out user");
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('challenges');
        this.setState({
            authenticated: false,
            user: null,
            ready: true,
            challenges: [],
        });
        if (wasForced && window.__ractf_alert) {
            details = details ? ("\n\nDetails: " + details) : "";
            window.__ractf_alert("Something went wrong loading the site. You have been logged out.\n" +
                "If this persists, please contact an admin." + details);
        }
    };

    login = (username, password, otp = null) => {
        return new Promise((resolve, reject) => {
            this.post(ENDPOINTS.LOGIN, { username, password, otp }
            ).then(data => {
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
                this._postLogin(data.d.token);
                resolve();
            }).catch(reject);
        });
    };

    add_2fa = () => this.post(ENDPOINTS.ADD_2FA);
    verify_2fa = (otp) => this.post(ENDPOINTS.VERIFY_2FA, { otp });
    requestPasswordReset = (email) => this.post(ENDPOINTS.REQUEST_RESET, { email });
    verify = (uid, token) => {
        try {
            uid = parseInt(uid, 10);
        } catch (e) { };
        return this.post(ENDPOINTS.VERIFY, { uid, token }).then(data => {
            this._postLogin(data.d.token);
        });
    };
    createGroup = (name, desc, type) => (
        this.post(ENDPOINTS.CATEGORIES, { name, metadata: null, description: desc, contained_type: type })
    );
    removeGroup = async (id) => {
        return this.delete(ENDPOINTS.CATEGORIES + id).then(() => {
            return this._reloadCache();
        });
    };
    editGroup = (id, name, desc, type) => (
        this.patch(ENDPOINTS.CATEGORIES + id, { name, description: desc, contained_type: type })
    );

    editChallenge = ({
        id, name, score, description, flag_type, flag_metadata, autoUnlock,
        challenge_metadata, author, challenge_type, unlocks, files, hidden
    }) => (
            this.patch(ENDPOINTS.CHALLENGES + id, {
                name, score, description,
                flag_type, flag_metadata,
                challenge_metadata, hidden,
                author, unlocks, files,
                challenge_type: challenge_type || "default",
                auto_unlock: autoUnlock,
            })
        );
    createChallenge = ({
        id, name, score, description, flag_type, flag_metadata, autoUnlock,
        challenge_metadata, author, challenge_type, unlocks, files, hidden
    }) => (
            this.post(ENDPOINTS.CHALLENGES, {
                category: id, name, score, description,
                flag_type, flag_metadata,
                challenge_metadata, hidden,
                author, unlocks, files,
                challenge_type: challenge_type || "default",
                auto_unlock: autoUnlock,
            })
        );
    removeChallenge = async (challenge, dumbRemove) => {
        if (!dumbRemove) {
            // Unlink all challenges
            await Promise.all(challenge.unlocks.map(i => (
                Promise.all(this.state.challenges.map(cat =>
                    Promise.all(cat.challenges.map(
                        j => new Promise((res, rej) => {
                            if (j.id === i)
                                this.linkChallenges(challenge, j, false).then(res).catch(rej);
                            else res();
                        })
                    ))
                ))
            )));
        }
        return this.delete(ENDPOINTS.CHALLENGES + challenge.id).then(() => {
            if (!dumbRemove)
                return this._reloadCache();
        });
    };

    linkChallenges = (chal1, chal2, linkState) => {
        if (linkState) {
            chal1.unlocks.push(chal2.id);
            chal2.unlocks.push(chal1.id);
        } else {
            chal1.unlocks = chal1.unlocks.filter(i => i !== chal2.id);
            chal2.unlocks = chal2.unlocks.filter(i => i !== chal1.id);
        }
        return Promise.all([
            this.patch(ENDPOINTS.CHALLENGES + chal1.id, { unlocks: chal1.unlocks }),
            this.patch(ENDPOINTS.CHALLENGES + chal2.id, { unlocks: chal2.unlocks })
        ]);
    };

    completePasswordReset = (id, secret, password) => {
        try {
            id = parseInt(id, 10);
        } catch (e) { }
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
        this.patch(ENDPOINTS.FILE + id, { name, url, size }).then(() => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal =>
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
        this.post(ENDPOINTS.FILE, { challenge: chalId, name, url, size }).then((resp) => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal => {
                    if (chal.id === chalId) {
                        chal.files.push(resp.d);
                    }
                })
            );
            this.setState({ challenges: this.state.challenges });
        });
    removeFile = (id) =>
        this.delete(ENDPOINTS.FILE + id).then(resp => resp.d).then(body => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal =>
                    chal.files = chal.files.filter(i => i && (i.id.toString() !== id.toString()))
                )
            );
            this.setState({ challenges: this.state.challenges });
            return body;
        });

    editHint = (id, name, cost, body) =>
        this.patch(ENDPOINTS.HINT + id, { name, cost, body }).then(() => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal =>
                    chal.hints.forEach(hint => {
                        if (hint.id === id) {
                            hint.name = name;
                            hint.penalty = cost;
                            hint.text = body;
                        }
                    })
                )
            );
            this.setState({ challenges: this.state.challenges });
        });
    newHint = (chalId, name, cost, body) =>
        this.post(ENDPOINTS.HINT, { challenge: chalId, name, penalty: cost, text: body }).then((resp) => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal => {
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
                group.challenges.forEach(chal =>
                    chal.hints.forEach(hint => {
                        if (hint.id === id) {
                            hint.text = body.text;
                            hint.used = true;
                        }
                    })
                )
            );
            this.setState({ challenges: this.state.challenges });
            return body;
        });
    removeHint = (id) =>
        this.delete(ENDPOINTS.HINT + id).then(resp => resp.d).then(body => {
            this.state.challenges.forEach(group =>
                group.challenges.forEach(chal =>
                    chal.hints = chal.hints.filter(i => i && (i.id.toString() !== id.toString()))
                )
            );
            this.setState({ challenges: this.state.challenges });
            return body;
        });


    runCode = (runType, fileName, fileContent) => {
        if (this.state.codeRunState.running) return;

        this.post(ENDPOINTS.RUN_CODE + runType, { exec: btoa(fileContent) }).then(resp => {
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
                <WS api={this}>
                    {this.props.children}
                </WS>
            </APIEndpoints.Provider>
        </APIContext.Provider>;
    };
}

const APIRouter = withRouter(APIClass);

export const API = (props) => {
    const { t } = useTranslation();
    return <APIRouter t={t} {...props} />;
};
