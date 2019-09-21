import React, { useContext, useState, createRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Page from "./bases/Page";
import Input from "../../components/Input";
import Button, { ButtonRow } from "../../components/Button";
import Spinner from "../../components/Spinner";
import Form, { formAction } from "../../components/Form";

import { APIContext } from "../controllers/API";

import { SectionTitle2, SubtleText } from "../../components/Misc";

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

const FormError = styled.div`
    color: #ac3232;
    font-weight: 500;
    font-size: 1.2em;
`;

const EMAIL_RE = /^\S+@\S+\.\S+$/;


export const JoinTeam = () => {
    const [message, setMessage] = useState("");
    const button = createRef();
    const submit = formAction();

    const doJoinTeam = ({ name, password }) => {

    }

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Join a Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/new"}>create a team</Link> instead?
            </SubtleText>

            <Form submit={submit} handle={doJoinTeam} button={button}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Join Team</Button>
                </ButtonRow>
            </Form>
        </AuthWrap>
    </Page>;
}

export const CreateTeam = () => {
    const [message, setMessage] = useState("");
    const button = createRef();
    const submit = formAction();

    const doCreateTeam = ({ name, affil, web, password }) => {

    }

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Create a New Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/join"}>join a team</Link> instead?
            </SubtleText>

            <Form submit={submit} handle={doCreateTeam} button={button}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"affil"} placeholder={"Affiliation"} />
                <Input name={"web"} placeholder={"Website"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Create Team</Button>
                </ButtonRow>
            </Form>
        </AuthWrap>
    </Page>;
}


export const EmailVerif = () => {
    const [verif, setVerif] = useState(0);

    setTimeout(() => {
        setVerif(2)
    }, 3000)

    return <Page vCentre>
        <AuthWrap>
            {verif === 0 ? <>
                <div>Verifying your account...</div>
                <Spinner />
            </> : verif === 1 ? <>
                <FormError>Account verification failed!</FormError>
            </> : verif === 2 ? <>
                <SectionTitle2>
                    Welcome to RACTF!
                </SectionTitle2>
                <div>Where to now, chief?</div>
                <ButtonRow>
                    <Button to={"/team/new"}>Create a Team</Button>
                    <Button to={"/team/join"}>Join a Team</Button>
                </ButtonRow>
            </> : null}
        </AuthWrap>
    </Page>;
}


export const EmailMessage = () => {
    return <Page vCentre>
        <AuthWrap>
            Thank you for registering!
            <br/><br/>
            Please check your indox for a verification link.
            <br/><br/>
            Make sure to check your spam folder if you can't find it!
        </AuthWrap>
    </Page>;
}


export const SignUp = () => {
    const api = useContext(APIContext);
    const [message, setMessage] = useState("");

    const doRegister = ({ username, passwd1, passwd2, email }) => {
        if (passwd1 !== passwd2)
            return setMessage("Passwords must match");
        if (!username)
            return setMessage("No username provided");
        if (!passwd1)
            return setMessage("No password provided");
        if (!email)
            return setMessage("No email provided");
        if (!EMAIL_RE.test(email))
            return setMessage("Invalid email");

        api.register(username, passwd1, email).then(
            message => {
                console.log(message);
            }
        ).catch(
            message => {
                if (message.response && message.response.data)
                    setMessage(message.response.data.m);
                else if (message.message)
                    setMessage(message.message);
                else setMessage("Unknown error occured.")
            }
        );
    }

    const submit = formAction();
    const button = createRef();

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Register for RACTF</SectionTitle2>

            <Form submit={submit} handle={doRegister} button={button}>
                <Input name={"username"} placeholder={"Username"} />
                <Input format={EMAIL_RE} name={"email"} placeholder={"Email"} />
                <Input name={"passwd1"} placeholder={"Password"} password />
                <Input name={"passwd2"} placeholder={"Repeat Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Register</Button>
                    <Button medium lesser to={"/login"}>Login</Button>
                </ButtonRow>
            </Form>
        </AuthWrap>
    </Page>;
};

export const LogIn = () => {
    const api = useContext(APIContext);
    const [message, setMessage] = useState("");

    const doRegister = ({ username, password }) => {
        if (!username)
            return setMessage("No username provided");
        if (!password)
            return setMessage("No password provided");

        api.login(username, password).then(
            message => {
                console.log(message);

            }
        ).catch(
            message => {
                window.msg = message;
                if (message.response && message.response.data)
                    setMessage(message.response.data.m);
                else if (message.message)
                    setMessage(message.message);
                else setMessage("Unknown error occured.")
            }
        );
    }

    const submit = formAction();
    const button = createRef();

    return <Page vCentre>
        <AuthWrap>
            <SectionTitle2>Login to RACTF</SectionTitle2>

            <Form submit={submit} handle={doRegister} button={button}>
                <Input name={"username"} placeholder={"Username"} />
                <Input name={"password"} placeholder={"Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Login</Button>
                    <Button medium lesser to={"/register"}>Register</Button>
                </ButtonRow>
            </Form>
        </AuthWrap>
    </Page>;
};
