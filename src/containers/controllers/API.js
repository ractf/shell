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
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",

        CHALLENGES: "/challenges",

        USER_SELF: "/members/self",
        USER: "/members/id/",
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
                console.log(response)
                resolve(response.data);
            }).catch(reject);
        });
    }

    reload_cache = async () => {
        // TODO: This
        try {
            const user_data = await this.get_user("self");
        } catch (e) {
            console.error(e);
        }

        try {
            const challenges = await this.get_challenges();
        } catch {
            return this.logout();
        }

        this.setState({
            ready: true,

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
        });
    }

    post_login = (username, id, token) => {
        localStorage.setItem("token", token);
        this.setState({
            authenticated: true,
            user: {
                username: username,
                id: id,
                referal: "/join/imagineHavingABackend",
            },
        });

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
        console.error("!!!!!REFUSING TO LOGOUT!!!!!")
        return;
        localStorage.removeItem('token');
        this.setState({
            authenticated: false,
            user: null,
            ready: false
        })
    }

    login = (username, password) => {
        return new Promise((resolve, reject) => {
            axios({
                url: this.BASE_URL + this.ENDPOINTS.LOGIN,
                method: "post",
                headers: this.get_headers(),
                data: {name: username, password: password}
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
                data: {name: username, password: password, email: email}
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
