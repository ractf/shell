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

import { H2, Button, Row } from "@ractf/ui-kit";
import { Wrap } from "./Parts";
import { useConfig } from "@ractf/util";
import Link from "components/Link";


const NoTeam = () => {
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");
    const user = useSelector(state => state.user);

    if (hasTeams && user.team !== null)
        return <Redirect to={"/campaign"} />;

    return <Wrap>
        <div style={{ textAlign: "center" }}>
            <H2>{t("auth.welcome")}</H2>
            <div>{t("auth.next")}</div>
            <br />
            <Row centre>
                {hasTeams ? <>
                    <Link to={"/team/new"}>
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
            </Row>
        </div>
    </Wrap>;
};
export default NoTeam;
