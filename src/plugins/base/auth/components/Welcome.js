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
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { useConfig } from "@ractf/shell-util";
import { Button, Page, Container } from "@ractf/ui-kit";

import Link from "components/Link";


const NoTeam = () => {
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");
    const user = useSelector(state => state.user);

    if (hasTeams && user.team !== null)
        return <Redirect to={"/campaign"} />;

    return <Page centre>
        <h2>{t("auth.welcome")}</h2>
        <div>{t("auth.next")}</div>
        <br />
        <Container centre toolbar>
            {hasTeams ? <>
                <Link to={"/team/create"}>
                    <Button>{t("create_a_team")}</Button>
                </Link>
                <Link to={"/team/join"}>
                    <Button>{t("join_a_team")}</Button>
                </Link>
            </> : <>
                <Link to={"/campaign"}>
                    <Button>{t("challenge_plural")}</Button>
                </Link>
                <Link to={"/settings"}>
                    <Button>{t("setting_plural")}</Button>
                </Link>
            </>}
        </Container>
    </Page>;
};
export default NoTeam;
