// Copyright (C) 2021 Really Awesome Technology Ltd
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

import React, { useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button, Card, Container, Form, Input, InputButton, SubtleText, UiKitModals } from "@ractf/ui-kit";
import { zxcvbn, useExperiment } from "@ractf/shell-util";
import { ENDPOINTS } from "@ractf/api";

import Link from "components/Link";
import * as actions from "actions";


export const TwoFAPanel = () => {
    const user = useSelector(state => state.user);
    const { t } = useTranslation();

    if (user.has_2fa) return (
        <Card lesser header={t("settings.cards.2fa")}>
            <p>{t("settings.2fa.enabled")}</p>
            <Link to={"/settings/2fa"}>
                <Button>{t("settings.2fa.disable")}</Button>
            </Link>
        </Card>
    );

    return (
        <Card warning lesser header={t("settings.cards.2fa")}>
            <h6>{t("settings.2fa.disabled")}</h6>
            <SubtleText>{t("settings.2fa.prompt")}</SubtleText>
            <Link to={"/settings/2fa"}>
                <Button warning>{t("settings.2fa.enable")}</Button>
            </Link>
        </Card>
    );
};

export const UsernamePanel = () => {
    const modals = useContext(UiKitModals);
    const user = useSelector(state => state.user);
    const [accOauth] = useExperiment("accOauth");
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const usernameValidator = useCallback(({ username }) => {
        return new Promise((resolve, reject) => {
            if (!username) return reject({ username: t("settings.uname_required") });
            if (username === user.username) return reject({ username: t("settings.uname_unchanged") });

            resolve();
        });
    }, [t, user.username]);
    const usernameChanged = useCallback(({ form: { username } }) => {
        modals.alert(t("settings.uname_changed"));
        dispatch(actions.editUser({ username }));
    }, [modals, dispatch, t]);

    return (
        <Card lesser header={t("settings.cards.identity")}>
            <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} validator={usernameValidator}
                postSubmit={usernameChanged}>
                <Form.Group htmlFor={"username"} label={t("username")}>
                    <InputButton name={"username"} label={t("username")} val={user.username}
                        limit={36} placeholder={t("username")} button={t("save")} submit />
                </Form.Group>
            </Form>
            {accOauth && (
                <Container toolbar centre>
                    <Button disabled lesser>Link Google account</Button>
                    <Button disabled lesser>Link RACTF passport</Button>
                </Container>
            )}
        </Card>
    );
};

export const PasswordPanel = () => {
    const modals = useContext(UiKitModals);
    const { t } = useTranslation();

    const passwordValidator = useCallback(({ old_password, password, new2 }) => {
        return new Promise((resolve, reject) => {
            if (!old_password)
                return reject({ old_password: t("settings.curr_pass_required") });
            if (!password)
                return reject({ password: t("settings.new_pass_required") });
            if (!new2)
                return reject({ new2: t("settings.new_pass_required") });
            if (password !== new2)
                return reject({ new2: t("auth.pass_match") });

            const strength = zxcvbn()(password);
            if (strength.score < 3)
                return reject({ password: strength.feedback.warning || t("auth.pass_weak") });

            resolve();
        });
    }, [t]);
    const passwordChanged = useCallback(() => {
        modals.alert(t("settings.pass_changed"));
    }, [modals, t]);

    return (
        <Card lesser header={t("settings.cards.change_password")}>
            <Form action={ENDPOINTS.CHANGE_PASSWORD} method={"POST"} validator={passwordValidator}
                postSubmit={passwordChanged}>
                <Form.Group>
                    <Input password name={"old_password"} placeholder={t("curr_pass")} />
                    <Input zxcvbn={zxcvbn()} password name={"password"} placeholder={t("new_pass")} />
                    <Input password name={"new2"} placeholder={t("new_pass")} />
                </Form.Group>
                <Button submit>{t("change_pass")}</Button>
            </Form>
        </Card>
    );
};
