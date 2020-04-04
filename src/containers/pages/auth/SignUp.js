import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, FormError, Page, SectionTitle2, Input, Button, ButtonRow,
    apiEndpoints, zxcvbn
} from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    const doRegister = ({ username, passwd1, passwd2, email }) => {
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

                {message && <FormError>{message}</FormError>}

                <ButtonRow right>
                    <Button medium lesser to={"/login"}>{t("login")}</Button>
                    <Button medium submit>{t("register")}</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
};
