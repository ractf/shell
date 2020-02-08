import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import zxcvbn from "zxcvbn";
import qs from "query-string";

import {
    Form, FormError, Page, SectionTitle2, Input, Button, apiEndpoints,
    appContext
} from "ractf";
import { Wrap } from "./Parts";

import useReactRouter from "../../../useReactRouter";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);

    const { location } = useReactRouter();
    const props = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (!(props.secret && props.id)) return <Redirect to={"/login"} />;

    const doReset = ({ passwd1, passwd2 }) => {
        if (passwd1 !== passwd2)
            return setMessage("Passwords must match");
        if (!passwd1)
            return setMessage("No password provided");

        const strength = zxcvbn(passwd1);
        if (strength.score < 3)
            return setMessage((strength.feedback.warning || "Password too weak."));

        setLocked(true);
        endpoints.completePasswordReset(props.id, props.secret, passwd1).then(() => {
            app.alert("Password reset! Please log in using your new password.");
        }).catch(
            message => {
                setMessage(endpoints.getError(message));
                setLocked(false);
            }
        );
    };

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doReset}>
                <SectionTitle2>Reset Password</SectionTitle2>
    
                <Input zxcvbn={zxcvbn} name={"passwd1"} placeholder={"New Password"} password />
                <Input name={"passwd2"} placeholder={"Repeat Password"} password />

                {message && <FormError>{message}</FormError>}

                <Button medium submit>Reset</Button>
            </Form>
        </Wrap>
    </Page>;
};
