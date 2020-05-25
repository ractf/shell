import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, FormError, Page, SectionTitle2, Input, Button, FlexRow, FormGroup,
    Link
} from "@ractf/ui-kit";
import { apiEndpoints, appContext } from "ractf";
import { Wrap, EMAIL_RE } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    const doLogin = ({ username, password, pin = null, backupCode = null }) => {
        if (!username)
            return setMessage(t("auth.no_uname"));
        if (!password)
            return setMessage(t("auth.no_pass"));

        setLocked(true);
        endpoints.login(username, password, pin, backupCode).catch(
            message => {
                if (message.response && message.response.data && message.response.data.d.reason === "2fa_required") {
                    // 2fa required
                    const faPrompt = () => {
                        app.promptConfirm({ message: t("2fa.required"), small: true },
                            [{ name: 'pin', placeholder: t("2fa.code_or_backup_prompt"),
                               format: /^(\d{6})|([A-Z0-9]{8})$/, limit: 8 }]
                        ).then(({ pin }) => {
                            if (pin.length !== 6 && pin.length !== 8) return faPrompt();
                
                            let backupCode = '';
                            if (pin.length === 8) {
                                backupCode = pin;
                                pin = '';
                            }

                            doLogin({ username: username, password: password, pin: pin, backupCode: backupCode });
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
                    <div className={"fgtpsdpmt"}>
                        <span onClick={openForget}>{t("auth.pass_forgot")}
                        </span> - <Link to={"/register"}>I need an account</Link>
                    </div>
                </FormGroup>

                {message && <FormError>{message}</FormError>}

                <FlexRow right>
                    <Button large submit>{t("login")}</Button>
                </FlexRow>
            </Form>
        </Wrap>
    </Page>;
};
