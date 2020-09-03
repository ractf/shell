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


const NoTeam = () => {
    const { t } = useTranslation();
    const team = useSelector(state => state.team);
    const hasTeams = useConfig("enable_teams");

    if (!hasTeams) return <Redirect to={"/"} />;

    if (team) return <Redirect to={"/team"} />;

    return <Wrap>
        <div style={{textAlign: "center"}}>
            <H2>{t("auth.welcome")}</H2>
            <br />
            <div>{t("auth.next")}</div>
            <Row centre>
                <Button to={"/team/new"}>{t("create_a_team")}</Button>
                <Button to={"/team/join"}>{t("join_a_team")}</Button>
            </Row>
        </div>
    </Wrap>;
};
export default NoTeam;
