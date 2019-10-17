import React, { useContext, useState } from "react";

import { Form, FormError, Page, SectionTitle2, Input, Button, ButtonRow, apiContext, appContext } from "ractf";
import { Wrap } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);

    const doLogin = ({ username, password, pin=null }) => {
        if (!username)
            return setMessage("No username provided");
        if (!password)
            return setMessage("No password provided");

        setLocked(true);
        api.login(username, password, pin).catch(
            message => {
                window.m = message;
                if (message.response && message.response.data && message.response.status === 401) {
                    // 2fa required
                    const faPrompt = () => {
                        app.promptConfirm({message: "2-Factor Code Required", small: true},
                                        [{name: 'pin', placeholder: '6-digit code', format: /^\d{6}$/, limit: 6}]).then(({ pin }) => {
                            if (pin.length !== 6) return faPrompt();
                            doLogin({username: username, password: password, pin: pin})
                        }).catch(() => {
                            setMessage("2-Factor Authentication Required!")
                            setLocked(false);
                        });
                    }
                    faPrompt();
                } else if (message.response && message.response.data) {
                    // We got a response from the server, but it wasn't happy with something
                    setMessage(message.response.data.m);
                    setLocked(false);
                } else if (message.message) {
                    // We didn't get a response from the server, but the browser is happy to tell us why
                    setMessage(message.message);
                    setLocked(false);
                } else {
                    setMessage("Unknown error occured.");
                    setLocked(false);
                }
            }
        );
    }

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doLogin}>
                <SectionTitle2>Login to RACTF</SectionTitle2>
    
                <Input name={"username"} placeholder={"Username"} />
                <Input name={"password"} placeholder={"Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button medium submit>Login</Button>
                    <Button medium lesser to={"/register"}>Register</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
};
