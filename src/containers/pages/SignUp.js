import React, { useContext, useState, createRef } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import Page from "./bases/Page";
import Input from "../../components/Input";
import Button, { ButtonRow } from "../../components/Button";

import { APIContext } from "../controllers/API";

import theme from "theme";
import { SectionTitle2 } from "../../components/Misc";

const AuthWrap = styled.div`
    border: 1px solid #373354;
    background-color: #2c2a4455;
    max-width: 600px;
    width: 100%;
    margin: auto;
    padding: 56px 64px;
    padding-bottom: 48px;
    border-radius: 2px;

    >div {
        margin-bottom: 16px;
    }
    >div:last-child {
        margin-bottom: 0;
    }
    >div:nth-last-child(2) {
        margin-bottom: 8px;
    }
`;

export const SignUp = () => {
    const api = useContext(APIContext);

    const doRegister = () => {
        api.register("test", "test123", "a@b.com").then(
            message => {
                console.log(message)
            }
        ).catch(
            message => {
                setMessage(message);
            }
        );
    }

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Register for RACTF</SectionTitle2>

            <Input placeholder={"Username"} />
            <Input placeholder={"Password"} password />
            <Input placeholder={"Repeat Password"} password />

            <ButtonRow>
                <Button click={doRegister} medium>Register</Button>
                <Button medium lesser to={"/login"}>Login</Button>
            </ButtonRow>
        </AuthWrap>
    </Page>
};

export const LogIn = withRouter(({ history }) => {
    const api = useContext(APIContext);
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState([false, false]);

    let username = createRef();
    let password = createRef();
    let activate = createRef();

    const doLogin = () => {
        api.login(username.current.state.val, password.current.state.val).then(() => {
            history.push("/")
        }).catch(e => {
            debugger;
            setMessage("Username or password incorrect");
            console.error(e);
            throw e;
        });
    }

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Login to RACTF</SectionTitle2>
            {message}

            <Input format={/.+/} callback={(_, val) => setValid([val, valid[1]])} placeholder={"Username"} ref={username} next={password} noCount />
            <Input format={/.+/} callback={(_, val) => setValid([valid[0], val])} placeholder={"Password"} ref={password} next={activate} password />

            <ButtonRow>
                <Button medium disabled={!(valid[0] && valid[1])} ref={activate} click={doLogin}>Login</Button>
                <Button medium lesser to={"/register"}>Register</Button>
            </ButtonRow>
        </AuthWrap>
    </Page>
});
