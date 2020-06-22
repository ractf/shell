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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, FormError, Page, Input, Button, Row, Link,
    Checkbox, FormGroup, H2
} from "@ractf/ui-kit";
import { Wrap, EMAIL_RE } from "./Parts";
import { register } from "@ractf/api";
import { zxcvbn } from "ractf";
import http from "@ractf/http";


export default () => {
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
        register(username, passwd1, email).catch(
            message => {
                setMessage(http.getError(message));
                setLocked(false);
            }
        );
    };

    return <Page centre>
        <Wrap>
            <Form locked={locked} handle={doRegister}>
                <H2>{t("auth.register")}</H2>

                <FormGroup>
                    <Input name={"username"} placeholder={t("username")} />
                    <Input format={EMAIL_RE} name={"email"} placeholder={t("email")} />
                    <Input zxcvbn={zxcvbn()} name={"passwd1"} placeholder={t("password")} password />
                    <Input name={"passwd2"} placeholder={t("password_repeat")} password />

                    <Checkbox name={"accept"}>
                        I accept the <Link to={"/conduct"}>terms of use</Link> and <Link to={"/privacy"}>
                            privacy policy
                        </Link>.
                    </Checkbox>
                </FormGroup>

                {message && <FormError>{message}</FormError>}

                <Row right>
                    <Button large submit>{t("register")}</Button>
                </Row>
            </Form>
        </Wrap>
    </Page>;
};
