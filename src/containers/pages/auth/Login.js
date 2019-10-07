import React, { useContext, useState, createRef } from "react";

import { Form, Page, SectionTitle2, Input, Button, ButtonRow, apiContext, formAction } from "ractf";
import { Wrap, FormError } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    const [message, setMessage] = useState("");

    const doRegister = ({ username, password }) => {
        if (!username)
            return setMessage("No username provided");
        if (!password)
            return setMessage("No password provided");

        api.login(username, password).catch(
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
        <Wrap>
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
        </Wrap>
    </Page>;
};
