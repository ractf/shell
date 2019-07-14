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
    DOMAIN = "//localhost:5000";
    API_BASE = "/";
    BASE_URL = this.PROTOCOL + this.DOMAIN + this.API_BASE;

    ENDPOINTS = {
        VALIDATE_TOKEN: "/validate_token",
        LOGIN: "/login",
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
        };
    }

    componentWillMount() {
        this.reload_cache();

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
            challenges: [],
            categories: [
                ["Cryptography", "crypto"],
                ["Miscelaneous", "misc"],
                ["Reverse Engineering", "reveng"],
                ["Steganography", "steg"],
                ["GNU+Linux", "linux"],
                ["World Wide Web", "www"], 
            ],

            user: {
                username: "Bottersnike",
                id: null,
                referal: "/join/imagineHavingABackend",
            },
        });
    }

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

    login = (data, success, failure, critical) => {
        axios({
            url: this.BASE_URL + this.ENDPOINTS.LOGIN,
            method: "post",
            data: {uname: data.username, password: data.password}
        }).then(response => {
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
        }).catch(critical);
    };

    render() {
        return <APIContext.Provider value={this.state}>{this.props.children}</APIContext.Provider>;
    }
}

export let API = withRouter(APIClass);
