import {withRouter} from "react-router-dom";
import React, {Component} from "react";
import axios from "axios";


export const APIContext = React.createContext({
    ready: false,
    authenticated: false,
    user: {
        username: null,
        id: null,
        referal: null,
    },
    challenges: [],
    categories: [],
});


class APIClass extends Component {
    PROTOCOL = "http:";
    DOMAIN = "//kylesbank.me:8000";
    API_BASE = "";
    BASE_URL = this.PROTOCOL + this.DOMAIN + this.API_BASE;

    ENDPOINTS = {
        VALIDATE_TOKEN: "/validate_token",
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
    };

    constructor() {
        super();

        this.state = {
            ready: false,
            authenticated: false,
            user: {
                username: null,
                id: null,
                referal: null,
            },
            challenges: [],
            categories: [],

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

    componentWillMount() {
        // this.reload_cache();

        let token = localStorage.getItem('token');
        if (token) {
            this.validate_token({token: token}, (data) => {
                this.setState({
                    user: {
                        username: data.username,
                        id: token.split(":")[0],
                    },
                    authenticated: true,
                    ready: true,
                });
            }, () => {
                this.setState({
                    authenticated: false,
                    ready: true,
                });
                console.warn("Previous token invalid!")
            }, (error) => {
                this.setState({
                    authenticated: false,
                    ready: true,
                });
                console.error("Failed to query API!\n" + error.toString());
            });
        } else {
            this.setState({
                ready: true,
            });
        }
    }

    reload_cache = () => {
        // TODO: This
        this.setState({
            challenges: [{
                category: "crypto",
                number: "1",
                name: "Crypto Chal 1",
                description: "HI!!!<br>Notice me, senapi~~!!!"
            }],
            categories: [
                ["Cryptography", "crypto"],
                ["Miscelaneous", "misc"],
                ["Reverse Engineering", "reveng"],
                ["Steganography", "steg"],
                ["GNU+Linux", "linux"],
                ["World Wide Web", "www"],
            ],

            authenticated: true,
            user: {
                username: "Bottersnike",
                id: null,
                referal: "/join/imagineHavingABackend",
            },
        });
    }

    // todo: this
    validate_token = (data, success, failure, critical) => {
        axios({
            url: this.BASE_URL + this.ENDPOINTS.VALIDATE_TOKEN,
            method: "post",
            data: {token: data.token},
        }).then(response => {
            if (response.data.success) success(response.data, this);
            else failure(response.data, this);
        }).catch(critical);
    };

    logout = () => {
        localStorage.removeItem('token');
        this.setState({
            authenticated: false,
            user: null,
        })
    }

    login = (username, password) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.LOGIN,
                method: "post",
                data: {name: username, password: password}
            }).then(response => {
                localStorage.setItem('token', response.data.token);
                this.reload_cache();
                resolve(response.data.token);
            }).catch(e => {
                console.log(e);
                console.log(e.response);
                reject(e.response);
            })
        });
    };

    register = (username, password, email) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.REGISTER,
                method: "post",
                data: {name: username, password: password, email: email}
            }).then(response => {
                console.log(response);
                reject();
                resolve(response.data.token);

                return;

                if (response.data.success) {
                    localStorage.setItem('token', response.data.token);

                    this.setState({
                        authenticated: true,
                        user: {
                            username: data.username,
                            id: response.data.token.split(":")[0]
                        }
                    });

                    success(response.data, this);
                }
                else failure(response.data, this);
            }).catch(reject)
        });
    };

    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export const API = withRouter(APIClass);
