import React, { useContext, useState } from "react";
import zxcvbn from "zxcvbn";

import { Form, FormError, Page, SectionTitle2, Input, Button, ButtonRow, apiContext } from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


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
        
        const strength = zxcvbn(passwd1);
        if (strength.score < 3) {
            return setMessage((strength.feedback.warning || "Password too weak."))
        }

        setLocked(true);
        api.register(username, passwd1, email).catch(
            message => {
                setMessage(api.getError(message))
                setLocked(false);
            }
        );
    }

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doRegister}>
                <SectionTitle2>Register for RACTF</SectionTitle2>
    
                <Input name={"username"} placeholder={"Username"} />
                <Input format={EMAIL_RE} name={"email"} placeholder={"Email"} />
                <Input zxcvbn name={"passwd1"} placeholder={"Password"} password />
                <Input name={"passwd2"} placeholder={"Repeat Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button medium lesser to={"/login"}>Login</Button>
                    <Button medium submit>Register</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
};
