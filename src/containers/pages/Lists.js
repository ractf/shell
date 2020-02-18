import React from "react";
import { useTranslation } from 'react-i18next';

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import { Table, Spinner, FormError, useApi, SectionTitle2 } from "ractf";


export const TeamsList = () => {
    const [allTeams, error] = useApi("/teams/list");
    const { t } = useTranslation();

    return <Page
        title={t("team_plural")} vCentre={error || !allTeams}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>{t("lists.all_teams")}</SectionTitle2>
            <br />
        </div>
        {error ? <>
            <FormError>
                {t("lists.teams_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> :
            allTeams ?
                <Table headings={[t("team"), t("website"), t("members")]} data={
                    allTeams.map(x => [x.name, x.website, x.members, "/team/" + x.id])
                } /> : <Spinner />
        }
    </Page>;
};


export const UsersList = () => {
    const [allUsers, error] = useApi("/members/list");
    const { t } = useTranslation();

    return <Page
        title={t("user_plural")} vCentre={error || !allUsers}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>{t("lists.all_users")}</SectionTitle2>
            <br />
        </div>
        {error ? <>
            <FormError>
                {t("lists.users_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> :
            allUsers ?
                <Table headings={[t("name"), t("team")]}
                    data={allUsers.map(x => [x.name, x.team_name, "/profile/" + x.id])} />
                : <Spinner />
        }
    </Page>;
};
