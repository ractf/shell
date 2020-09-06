// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useContext, useCallback, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Button, Row, FormGroup, H2, FormError, SubtleText
} from "@ractf/ui-kit";
import { ENDPOINTS, postLogin, requestPasswordReset } from "@ractf/api";
import { appContext } from "ractf";
import { EMAIL_RE } from "@ractf/util";
import http from "@ractf/http";
import { Wrap } from "./Parts";
import Link from "components/Link";


const BasicLogin = () => {
    const app = useContext(appContext);
    const { t } = useTranslation();
    const [needsOtp, setNeedsOtp] = useState(false);
    const submit = useRef();

    const openForget = useCallback(() => {
        app.promptConfirm({ message: t("auth.enter_email"), okay: t("auth.send_link"), small: true },
            [{ name: "email", placeholder: t("email"), format: EMAIL_RE }]
        ).then(({ email }) => {
            requestPasswordReset(email).then(() => {
                app.alert(t("auth.email_sent"));
            }).catch(e => {
                app.alert(http.getError(e));
            });
        });
    }, [app, t]);

    const onError = useCallback(({ resp, retry, showError }) => {
        if (resp && resp.reason === "2fa_required") {
            const faPrompt = () => {
                setNeedsOtp(true);
                app.promptConfirm({ message: t("2fa.required"), small: true },
                    [{ name: "pin", placeholder: t("2fa.code_prompt"), format: /^\d{6}$/, limit: 6 }]
                ).then(({ pin }) => {
                    if (pin.length !== 6) return faPrompt();
                    submit.current({ tfa: pin });
                    setNeedsOtp(false);
                }).catch(() => {
                    showError(t("2fa.canceled"));
                    setNeedsOtp(false);
                });
            };
            faPrompt();

            return false;
        }
    }, [app, t]);
    const afterLogin = useCallback(({ resp: { token } }) => {
        postLogin(token);
    }, []);

    return <Wrap>
        <Form action={needsOtp ? ENDPOINTS.LOGIN_2FA : ENDPOINTS.LOGIN} onError={onError}
            postSubmit={afterLogin} method={"POST"} submitRef={submit}>
            <H2>{t("auth.login")}</H2>
            <FormGroup>
                <Input name={"username"} required placeholder={t("username")} autoFocus />
                <Input name={"password"} required placeholder={t("password")} password />
                <SubtleText>
                    <Link onClick={openForget}>{t("auth.pass_forgot")}
                    </Link> - <Link to={"/register"}>I need an account</Link>
                </SubtleText>
            </FormGroup>

            <FormError />
            <Row right>
                <Button large submit>{t("login")}</Button>
            </Row>
        </Form>
    </Wrap>;
};
export default React.memo(BasicLogin);
