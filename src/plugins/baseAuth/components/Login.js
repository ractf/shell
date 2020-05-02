import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, FormError, Page, SectionTitle2, Input, Button, FlexRow,
    apiEndpoints, appContext, FormGroup
} from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    const doLogin = ({ username, password, pin = null }) => {
        if (!username)
            return setMessage(t("auth.no_uname"));
        if (!password)
            return setMessage(t("auth.no_pass"));

        setLocked(true);
        endpoints.login(username, password, pin).catch(
            message => {
                if (message.response && message.response.data && message.response.data.d.reason === "2fa_required") {
                    // 2fa required
                    const faPrompt = () => {
                        app.promptConfirm({ message: t("2fa.required"), small: true },
                            [{ name: 'pin', placeholder: t("2fa.code_prompt"), format: /^\d{6}$/, limit: 6 }]
                        ).then(({ pin }) => {
                            if (pin.length !== 6) return faPrompt();
                            doLogin({ username: username, password: password, pin: pin });
                        }).catch(() => {
                            setMessage(t("2fa.canceled"));
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
        app.promptConfirm({ message: t("auth.enter_email"), okay: t("auth.send_link"), small: true },
            [{ name: "email", placeholder: t("email"), format: EMAIL_RE }]
        ).then(({ email }) => {
            endpoints.requestPasswordReset(email).then(() => {
                app.alert(t("auth.email_sent"));
            }).catch(e => {
                app.alert(endpoints.getError(e));
            });
        });
    };

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doLogin}>
                <SectionTitle2>{t("auth.login")}</SectionTitle2>
                <FormGroup>
                    <Input name={"username"} placeholder={t("username")} />
                    <Input name={"password"} placeholder={t("password")} password />
                </FormGroup>
                <div onClick={openForget} className={"fgtpsdpmt"}>{t("auth.pass_forgot")}</div>

                {message && <FormError>{message}</FormError>}

                <FlexRow right>
                    <Button large lesser to={"/register"}>{t("register")}</Button>
                    <Button large submit>{t("login")}</Button>
                </FlexRow>
            </Form>
        </Wrap>
    </Page>;
};
