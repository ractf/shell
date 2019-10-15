import React, { useContext, useState, createRef } from "react";

import { Form, Page, SectionTitle2, Input, Button, ButtonRow, apiContext, formAction } from "ractf";
import { Wrap, FormError, EMAIL_RE } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);

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

        setLocked(true);
        api.register(username, passwd1, email).catch(
            message => {
                if (message.response && message.response.data)
                    setMessage(message.response.data.m);
                else if (message.message)
                    setMessage(message.message);
                else setMessage("Unknown error occured.");
                setLocked(false);
            }
        );
    }

    const submit = formAction();
    const button = createRef();

    return <Page vCentre>
        <Wrap locked={locked}>
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
        </Wrap>
    </Page>;
};
