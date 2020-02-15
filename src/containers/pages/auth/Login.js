import React, { useContext, useState } from "react";

import {
    Form, FormError, Page, SectionTitle2, Input, Button, ButtonRow,
    apiEndpoints, appContext
} from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);

    const doLogin = ({ username, password, pin = null }) => {
        if (!username)
            return setMessage("No username provided");
        if (!password)
            return setMessage("No password provided");

        setLocked(true);
        endpoints.login(username, password, pin).catch(
            message => {
                window.m = message;
                if (message.response && message.response.data && message.response.status === 401) {
                    // 2fa required
                    const faPrompt = () => {
                        app.promptConfirm({ message: "2-Factor Code Required", small: true },
                            [{ name: 'pin', placeholder: '6-digit code', format: /^\d{6}$/, limit: 6 }]
                        ).then(({ pin }) => {
                            if (pin.length !== 6) return faPrompt();
                            doLogin({ username: username, password: password, pin: pin });
                        }).catch(() => {
                            setMessage("2-Factor Authentication Required!");
                            setLocked(false);
                        });
                    };
                    faPrompt();
                } else {
                    setMessage(endpoints.getError(message));
                    setLocked(false);
                }
            }
        );
    };

    const openForget = () => {
        app.promptConfirm({ message: "Enter your email to reset your password", okay: "Send Link", small: true },
            [{ name: "email", placeholder: "Email", format: EMAIL_RE }]
        ).then(({ email }) => {
            endpoints.requestPasswordReset(email).then(() => {
                app.alert("Email sent, check your inbox");
            }).catch(e => {
                app.alert(endpoints.getError(e));
            });
        });
    };

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doLogin}>
                <SectionTitle2>Login to RACTF</SectionTitle2>

                <Input name={"username"} placeholder={"Username"} />
                <Input name={"password"} placeholder={"Password"} password />
                <div onClick={openForget} className={"fgtpsdpmt"}>I forgot my password</div>

                {message && <FormError>{message}</FormError>}

                <ButtonRow right>
                    <Button medium lesser to={"/register"}>Register</Button>
                    <Button medium submit>Login</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
};
