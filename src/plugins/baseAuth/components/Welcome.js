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

import { H2, Button, Row } from "@ractf/ui-kit";
import { Wrap } from "./Parts";
import { useConfig } from "@ractf/util";


const NoTeam = () => {
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");

    return <Wrap>
        <div style={{textAlign: "center"}}>
            <H2>{t("auth.welcome")}</H2>
            <div>{t("auth.next")}</div>
            <br />
            <Row centre>
                {hasTeams ? <>
                    <Button to={"/team/new"}>{t("create_a_team")}</Button>
                    <Button to={"/team/join"}>{t("join_a_team")}</Button>
                </> : <>
                    <Button to={"/campaign"}>{t("challenge_plural")}</Button>
                    <Button to={"/settings"}>{t("setting_plural")}</Button>
                </>}
            </Row>
        </div>
    </Wrap>;
};
export default NoTeam;
