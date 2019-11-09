import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";

import { ModalPrompt } from "../../components/Modal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { APIContext, AppContext } from "./Contexts";
import Routes from "./Routes";
import { API } from "./API";

import { plugins } from "ractf";

import "./App.scss";



export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            console: false,

            currentPrompt: null,
            promptConfirm: this.promptConfirm,

            popups: [
                {type: 0, title: 'Achievement get', body: 'You got a thing!'},
                {type: 'medal', medal: 'winner'},
                {type: 0, title: 'Challenge solved', body: 'solved a thing'},
            ],

            modals: 1
        }

        this.magic = [27, 16, 186, 81, 16, 49, 13]
        this.current = [];

        this.loaded = false;
        // 3s grace period to connect to the server
        setTimeout(() => { this.loaded = true }, 3000);
    }

    hideModal = () => {
        this.setState({ currentPrompt: null });
    }

    promptConfirm = (body, inputs = 0) => {
        if (inputs === 0) inputs = [];

        return new Promise((resolveOuter, rejectOuter) => {
            let innerPromise = new Promise((resolve, reject) => {
                this.setState({
                    currentPrompt: { body: body, promise: { resolve: resolve, reject: reject }, inputs: inputs }
                });
            });

            innerPromise.then(values => {
                this.hideModal();
                resolveOuter(values);
            }).catch(values => {
                this.hideModal();
                rejectOuter(values);
            });
        });
    }

    _handleKeyDown = (event) => {
        if (event.keyCode === 16 && this.current[this.current.length - 1] === 16)
            return
        this.current.push(event.keyCode);
        if (this.current.length > this.magic.length)
            this.current = this.current.slice(this.current.length - this.magic.length, this.current.length);
        if (JSON.stringify(this.current) === JSON.stringify(this.magic))
            this.setState({ console: true });
    }
    componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

    newModal = () => {
        this.setState({ modals: this.state.modals + 1 })
    }

    render() {
        if (this.state.console) return <div className={"vimDiv"}>
            {`[www-data@ractfhost1 shell]$ npm run build
[www-data@ractfhost1 shell]$ python3.7 -m http.server --directory build 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...

Keyboard interrupt received, exiting.

[www-data@ractfhost1 shell]$ `}
        </div>;

        const removePopup = (n) => {
            let popups = [...this.state.popups];
            popups.splice(n, 1);
            this.setState({popups: popups});
        }
        let popups = this.state.popups.map((popup, n) => {
            let handler = plugins.popup[popup.type];
            if (!handler) return <div className={"eventPopup"} onClick={()=>removePopup(n)} key={n}>Plugin handler missing for '{popup.type}'!</div>;
            return <div className={"eventPopup"} onClick={()=>removePopup(n)} key={n}>{React.createElement(
                handler.component, {popup: popup, key:n}
            )}</div>;
        }).reverse();

        return (
            <AppContext.Provider value={this.state}>
                <BrowserRouter>
                    <API><APIContext.Consumer>{api => <>
                        {/* TODO: Use api.ready */}
                        {!api.ready && this.loaded ? <div className={"siteWarning"}>
                            Site operating in offline mode:
                            Failed to connect to the CTF servers!<br />
                            Functionality will be limited until service is restored.
                        </div> : null}
                        {(api.user && api.user['2fa_status'] === "needs_verify") ? <div className={"siteWarning"}>
                            A previous attempt to add 2-factor authentication to your account failed!<br />
                            Please visit settings to finish configuration!
                        </div> : null}
                        
                        <Header />
                        <Routes />
                        <Footer />
                    </>}</APIContext.Consumer></API>
                </BrowserRouter>

                {this.state.currentPrompt ? <ModalPrompt
                    body={this.state.currentPrompt.body}
                    promise={this.state.currentPrompt.promise}
                    inputs={this.state.currentPrompt.inputs}
                    onHide={this.hideModal}
                /> : null}

                <div className={"eventsWrap"}>
                    {popups}
                </div>
            </AppContext.Provider>
        );
    }
}
