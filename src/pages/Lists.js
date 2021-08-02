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

import React from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    Page, PageHead
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { useConfig } from "@ractf/shell-util";

import Link from "components/Link";
import PaginatedTable from "components/PaginatedTable";


export const TeamsList = () => {
    const hasTeams = useConfig("enable_teams");
    const { t } = useTranslation();

    if (!hasTeams)
        return <Redirect to={"/"} />;

    return <Page title={t("team_plural")}>
        <PageHead>{t("lists.all_teams")}</PageHead>
        <PaginatedTable
            headers={{
                "Team": "name",
                "Members": "members_count"
            }}
            defaultOrdering="name"
            endpoint={ENDPOINTS.TEAM}
            transformerFunction={x => [
                <Link to={`/team/${x.id}`}>{x.name}</Link>,
                <Link to={`/team/${x.id}`}>{x.members}</Link>,
            ]}
        />
    </Page>;
};

export const UsersList = () => {
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");

    return <Page title={t("user_plural")}>
        <PageHead>{t("lists.all_users")}</PageHead>
        <PaginatedTable 
            headers={{
                "Name": "username",
                ...(hasTeams && {"Team": "team__name"})
            }}
            defaultOrdering="username"
            endpoint={ENDPOINTS.USER}
            transformerFunction={x => [
                <Link to={`/profile/${x.id}`}>{x.username}</Link>,
                hasTeams && <Link to={`/profile/${x.id}`}>{x.team_name}</Link>
            ].filter(i => i !== false)}
        />
    </Page>;
};
