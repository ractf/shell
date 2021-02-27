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

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { ENDPOINTS } from "@ractf/api";
import { EMAIL_RE, escapeRegex, useReactRouter } from "@ractf/util";
import { useConfig, zxcvbn } from "@ractf/shell-util";
import {
    Form, Input, Button, Checkbox, SubtleText
} from "@ractf/ui-kit";

import Link from "components/Link";
import qs from "query-string";
import { push } from "connected-react-router";

import { Wrap } from "./Parts";


export default () => {
    const { t } = useTranslation();
    const inviteRequired = useConfig("invite_required", false);
    const dispatch = useDispatch();

    const { location } = useReactRouter();
    const { invite } = qs.parse(location.search, { ignoreQueryPrefix: true });

    const emailDomain = useConfig("email_domain");
    const emailRegex = useConfig("email_regex");

    let localEmailRegex;
    if (emailRegex)
        localEmailRegex = emailRegex;
    else if (emailDomain)
        localEmailRegex = new RegExp("^.*@" + escapeRegex(emailDomain.replace(/^@+/, "")) + "$");
    else
        localEmailRegex = EMAIL_RE;

    const regValidator = useCallback(({ username, email, password, password2, invite, accept }) => {
        return new Promise((resolve, reject) => {
            if (!email)
                return reject({ email: t("auth.no_email") });
            if (!localEmailRegex.test(email))
                return reject({ email: t("auth.inv_email") });

            const strength = zxcvbn()(password);
            if (strength.score < 3)
                return reject({ password: (strength.feedback.warning || t("auth.pass_weak")) });
            if (password !== password2)
                return reject({ password2: t("auth.pass_match") });

            if (inviteRequired && !invite)
                return reject({ invite: t("auth.no_invite") });
            if (!accept)
                return reject({ accept: t("auth.no_accept") });

            resolve();
        });
    }, [inviteRequired, localEmailRegex, t]);

    const afterSignUp = useCallback(() => {
        dispatch(push("/register/email"));
    }, [dispatch]);

    return <Wrap>
        <Form action={ENDPOINTS.REGISTER} method={"POST"} validator={regValidator} postSubmit={afterSignUp}>
            <h2>{t("auth.register")}</h2>

            <Form.Group>
                <Input name={"username"} placeholder={t("username")} required autoFocus />
                <Input format={localEmailRegex} name={"email"} required placeholder={t("email")} />
                {(!emailRegex && emailDomain) && (
                    <SubtleText>A <code>{emailDomain}</code> email is required for registration.</SubtleText>
                )}
                {emailRegex && (
                    <SubtleText>
                        The owner of this site has set a complex email requirement.<br />
                            Please contact them for details.
                    </SubtleText>
                )}
                <Input zxcvbn={zxcvbn()} name={"password"} placeholder={t("password")} required password />
                <Input name={"password2"} placeholder={t("password_repeat")} required password />

                {inviteRequired && (
                    <Input val={invite || ""} disabled={!!invite} name={"invite"}
                        placeholder={t("invite_code")} required />
                )}

                <Checkbox name={"accept"}>
                    I accept the <Link to={"/conduct"}>terms of use</Link> and <Link to={"/privacy"}>
                        privacy policy
                        </Link>.
                    </Checkbox>
            </Form.Group>

            <Form.Error IS_FOR_ERROR />
            <Button fullWidth submit>{t("register")}</Button>
            <SubtleText>
                <Link to={"/login"}>I already have an account</Link>
            </SubtleText>
        </Form>
    </Wrap>;
};
