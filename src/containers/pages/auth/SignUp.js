import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, FormError, Page, SectionTitle2, Input, Button, FlexRow,
    apiEndpoints, zxcvbn, Checkbox, Link
} from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    const doRegister = ({ accept, username, passwd1, passwd2, email }) => {
        if (!accept)
            return setMessage("You must accept the terms of use and privacy policy to register.");
        if (passwd1 !== passwd2)
            return setMessage(t("auth.pass_match"));
        if (!username)
            return setMessage(t("auth.no_uname"));
        if (!passwd1)
            return setMessage(t("auth.no_pass"));
        if (!email)
            return setMessage(t("auth.no_email"));
        if (!EMAIL_RE.test(email))
            return setMessage(t("auth.inv_email"));
        
        const strength = zxcvbn()(passwd1);
        if (strength.score < 3) {
            return setMessage((strength.feedback.warning || t("auth.pass_weak")));
        }

        setLocked(true);
        endpoints.register(username, passwd1, email).catch(
            message => {
                setMessage(endpoints.getError(message));
                setLocked(false);
            }
        );
    };

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doRegister}>
                <SectionTitle2>{t("auth.register")}</SectionTitle2>
    
                <Input name={"username"} placeholder={t("username")} />
                <Input format={EMAIL_RE} name={"email"} placeholder={t("email")} />
                <Input zxcvbn={zxcvbn()} name={"passwd1"} placeholder={t("password")} password />
                <Input name={"passwd2"} placeholder={t("password_repeat")} password />

                <Checkbox name={"accept"}>
                    I accept the <Link to={"/conduct"}>terms of use</Link> and <Link to={"/privacy"}>
                        privacy policy
                    </Link>.
                </Checkbox>

                {message && <FormError>{message}</FormError>}

                <FlexRow right>
                    <Button large lesser to={"/login"}>{t("login")}</Button>
                    <Button large submit>{t("register")}</Button>
                </FlexRow>
            </Form>
        </Wrap>
    </Page>;
};
