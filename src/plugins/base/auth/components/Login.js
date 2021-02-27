// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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
    Form, Input, Button, SubtleText, UiKitModals
} from "@ractf/ui-kit";
import { ENDPOINTS, reloadAll, postLogin, requestPasswordReset } from "@ractf/api";
import { EMAIL_RE } from "@ractf/util";
import * as http from "@ractf/util/http";

import Link from "components/Link";

import { Wrap } from "./Parts";


const BasicLogin = () => {
    const modals = useContext(UiKitModals);
    const { t } = useTranslation();
    const [needsOtp, setNeedsOtp] = useState(false);
    const submit = useRef();

    const openForget = useCallback(() => {
        modals.promptConfirm({ message: t("auth.enter_email"), okay: t("auth.send_link"), small: true },
            [{ name: "email", placeholder: t("email"), format: EMAIL_RE }]
        ).then(({ email }) => {
            requestPasswordReset(email).then(() => {
                modals.alert(t("auth.email_sent"));
            }).catch(e => {
                if (e === "permission_denied")
                    // We're already logged in
                    reloadAll();
                else
                    modals.alert(http.getError(e));
            });
        });
    }, [modals, t]);

    const onError = useCallback(({ resp, retry, showError }) => {
        if (resp && resp.reason === "2fa_required") {
            const faPrompt = () => {
                setNeedsOtp(true);
                modals.promptConfirm({ message: t("2fa.required"), small: true },
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
    }, [modals, t]);
    const afterLogin = useCallback(({ resp: { token } }) => {
        postLogin(token);
    }, []);

    return <Wrap>
        <Form action={needsOtp ? ENDPOINTS.LOGIN_2FA : ENDPOINTS.LOGIN} onError={onError}
            postSubmit={afterLogin} method={"POST"} submitRef={submit}>
            <h2>{t("auth.login")}</h2>
            <Form.Group>
                <Input name={"username"} required placeholder={t("username")} autoFocus />
                <Input name={"password"} required placeholder={t("password")} password />
            </Form.Group>

            <Form.Error />
            <Button fullWidth submit>{t("login")}</Button>
            <SubtleText>
                <Link onClick={openForget}>{t("auth.pass_forgot")}
                </Link> - <Link to={"/register"}>I need an account</Link>
            </SubtleText>
        </Form>
    </Wrap>;
};
export default React.memo(BasicLogin);
