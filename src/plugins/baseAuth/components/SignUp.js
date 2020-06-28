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

import React from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Page, Input, Button, Row, Link, Checkbox, FormGroup, H2
} from "@ractf/ui-kit";
import { Wrap, EMAIL_RE } from "./Parts";
import { ENDPOINTS } from "@ractf/api";
import { zxcvbn } from "ractf";


export default () => {
    const { t } = useTranslation();

    const regValidator = ({ username, email, password, password2, accept }) => {
        return new Promise((resolve, reject) => {
            if (!username)
                return reject({ username: t("auth.no_uname") });
            if (!email)
                return reject({ email: t("auth.no_email") });
            if (!EMAIL_RE.test(email))
                return reject({ email: t("auth.inv_email") });
            
            if (!password)
                return reject({ password: t("auth.no_pass") });
            const strength = zxcvbn()(password);
            if (strength.score < 3)
                return reject({ password: (strength.feedback.warning || t("auth.pass_weak")) });
            if (password !== password2)
                return reject({ password2: t("auth.pass_match") });
            
            if (!accept)
                return reject({ accept: t("auth.no_accept") });
            
            resolve();
        });
    };

    return <Page centre>
        <Wrap>
            <Form action={ENDPOINTS.REGISTER} method={"POST"} validator={regValidator}>
                <H2>{t("auth.register")}</H2>

                <FormGroup>
                    <Input name={"username"} placeholder={t("username")} />
                    <Input format={EMAIL_RE} name={"email"} placeholder={t("email")} />
                    <Input zxcvbn={zxcvbn()} name={"password"} placeholder={t("password")} password />
                    <Input name={"password2"} placeholder={t("password_repeat")} password />

                    <Checkbox name={"accept"}>
                        I accept the <Link to={"/conduct"}>terms of use</Link> and <Link to={"/privacy"}>
                            privacy policy
                        </Link>.
                    </Checkbox>
                </FormGroup>

                <Row right>
                    <Button large submit>{t("register")}</Button>
                </Row>
            </Form>
        </Wrap>
    </Page>;
};
