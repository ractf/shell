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
    Page, Table, Button, PageHead, Container, Form
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { usePaginated } from "@ractf/util/http";
import { useConfig } from "@ractf/shell-util";

import Link from "components/Link";

import { BrokenShards } from "./ErrorPages";


export const TeamsList = () => {
    //const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.TEAM);
    const [state, next] = usePaginated(ENDPOINTS.TEAM);
    const hasTeams = useConfig("enable_teams");

    const { t } = useTranslation();

    if (!hasTeams)
        return <Redirect to={"/"} />;

    return <Page title={t("team_plural")} centre={!!state.error}>
        <PageHead>{t("lists.all_teams")}</PageHead>
        {state.error ? <>
            <Form.Error>
                {t("lists.teams_error")}<br />{t("lists.try_reload")}
            </Form.Error>
            <BrokenShards />
        </> : <>
            <Table headings={[t("team"), t("members")]} data={
                state.data.map(x => [
                    <Link to={`/team/${x.id}`}>{x.name}</Link>,
                    <Link to={`/team/${x.id}`}>{x.members}</Link>,
                ])
            } />
            {!state.hasMore && (<Container full centre>
                <Button disabled={state.loading} onClick={next}>{t("load_more")}</Button>
            </Container>)}
        </>}
    </Page>;
};

export const UsersList = () => {
    //const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.USER);
    const [state, next] = usePaginated(ENDPOINTS.USER);
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");

    return <Page title={t("user_plural")} centre={!!state.error}>
        <PageHead>{t("lists.all_users")}</PageHead>

        {state.error ? <>
            <Form.Error>
                {t("lists.users_error")}<br />{t("lists.try_reload")}
            </Form.Error>
            <BrokenShards />
        </> : <>
            <Table headings={[t("name"), hasTeams && t("team")].filter(Boolean)} data={
                state.data.map(x => [
                    <Link to={`/profile/${x.id}`}>{x.username}</Link>,
                    hasTeams && <Link to={`/profile/${x.id}`}>{x.team_name}</Link>
                ].filter(i => i !== false))
            } />
            {state.hasMore && (<Container full centre>
                <Button disabled={state.loading} onClick={next}>{t("load_more")}</Button>
            </Container>)}
        </>}
    </Page>;
};
