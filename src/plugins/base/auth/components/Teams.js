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

import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
    Form, HR, Input, Button, SubtleText, Container
} from "@ractf/ui-kit";
import { joinTeam, createTeam, reloadAll } from "@ractf/api";
import { useConfig } from "@ractf/shell-util";
import * as http from "@ractf/util/http";

import Link from "components/Link";

import { Wrap } from "./Parts";


export const JoinTeam = () => {
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);
    const team = useSelector(state => state.team);
    const hasTeams = useConfig("enable_teams");

    if (!hasTeams)
        return <Redirect to={"/"} />;

    if (team !== null)
        return <Redirect to={"/team/me"} />;

    const doJoinTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage(t("team_wiz.name_missing"));

        setLocked(true);
        joinTeam(name, password).then(resp => {
            setSuccess(true);
        }).catch(e => {
            setMessage(http.getError(e));
            setLocked(false);
        });
    };

    return <Wrap>{success ?
        <div style={{ textAlign: "center" }}>
            <h2>{t("team_wiz.joined")}</h2>
            <HR />
            <p>{t("team_wiz.next")}</p>

            <Container toolbar>
                <Link to={"/campaign"}>
                    <Button >{t("challenge_plural")}</Button>
                </Link>
                <Link to={"/settings"}>
                    <Button lesser>{t("setting_plural")}</Button>
                </Link>
            </Container>
        </div> : <>
            <Form locked={locked} handle={doJoinTeam}>
                <h2>{t("join_a_team")}</h2>
                <Form.Group>
                    <Input autofill={"off"} name={"name"} placeholder={t("team_name")} required />
                    <Input autofill={"off"} name={"password"} placeholder={t("team_secret")} required password />
                </Form.Group>

                {message && <Form.Error>{message}</Form.Error>}

                <SubtleText>
                    {t("team_wiz.did_you_want_to")}
                    <Link to={"/team/create"}>{t("team_wiz.create_a_team")}</Link>
                    {t("team_wiz.instead")}
                </SubtleText>
                <Button fullWidth submit>{t("team_wiz.join")}</Button>
            </Form>
        </>}
    </Wrap>;
};

export const CreateTeam = () => {
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);
    const team = useSelector(state => state.team);
    const hasTeams = useConfig("enable_teams");

    if (!hasTeams)
        return <Redirect to={"/"} />;

    if (team !== null)
        return <Redirect to={"/team/me"} />;

    const doCreateTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage(t("team_wiz.name_missing"));
        if (password.length < 8)
            return setMessage(t("team_wiz.pass_short"));

        setLocked(true);
        createTeam(name, password).then(resp => {
            reloadAll();
            setSuccess(true);
        }).catch(e => {
            setMessage(http.getError(e));
            setLocked(false);
        });
    };

    return <Wrap>{!success ?
        <div style={{ textAlign: "center" }}>
            <h2>{t("team_wiz.created")}</h2>
            <HR />
            <p>{t("team_wiz.next")}</p>

            <Container toolbar>
                <Link to={"/campaign"}>
                    <Button>{t("challenge_plural")}</Button>
                </Link>
                <Link to={"/settings"}>
                    <Button lesser>{t("setting_plural")}</Button>
                </Link>
            </Container>
        </div> : <>
            <Form locked={locked} handle={doCreateTeam}>
                <h2>{t("create_a_team")}</h2>
                <Form.Group>
                    <Input autofill={"off"} name={"name"} limit={36} placeholder={t("team_name")} required />
                    <Input autofill={"off"} name={"password"} placeholder={t("team_secret")} required password />
                    <SubtleText>{t("team_secret_warn")}</SubtleText>
                </Form.Group>

                {message && <Form.Error>{message}</Form.Error>}

                <SubtleText>
                    {t("team_wiz.did_you_want_to")}
                    <Link to={"/team/join"}>{t("team_wiz.join_a_team")}</Link>
                    {t("team_wiz.instead")}
                </SubtleText>
                <Button fullWidth submit>{t("team_wiz.create")}</Button>
            </Form>
        </>}
    </Wrap>;
};
