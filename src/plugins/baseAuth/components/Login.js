import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, FormError, Page, Input, Button, Row, FormGroup,
    Link, H2
} from "@ractf/ui-kit";
import { apiEndpoints, appContext } from "ractf";
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

    return <Page centre>
        <Wrap>
            <Form locked={locked} handle={doLogin}>
                <H2>{t("auth.login")}</H2>
                <FormGroup>
                    <Input name={"username"} placeholder={t("username")} />
                    <Input name={"password"} placeholder={t("password")} password />
                    <div className={"fgtpsdpmt"}>
                        <span onClick={openForget}>{t("auth.pass_forgot")}
                        </span> - <Link to={"/register"}>I need an account</Link>
                    </div>
                </FormGroup>

                {message && <FormError>{message}</FormError>}

                <Row right>
                    <Button large submit>{t("login")}</Button>
                </Row>
            </Form>
        </Wrap>
    </Page>;
};
