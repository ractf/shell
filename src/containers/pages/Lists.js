import React from "react";
import { useTranslation } from 'react-i18next';

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import {
    Table, FormError, SectionTitle2, usePaginated, Button, ENDPOINTS, FlexRow
} from "ractf";


export const TeamsList = () => {
    //const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.TEAM);
    const [state, next] = usePaginated(ENDPOINTS.TEAM); 

    const { t } = useTranslation();

    return <Page
        title={t("team_plural")} vCentre={state.error}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>{t("lists.all_teams")}</SectionTitle2>
            <br />
        </div>
        {state.error ? <>
            <FormError>
                {t("lists.teams_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> : <>
            <Table headings={[t("team"), t("website"), t("members")]} data={
                state.data.map(x => [x.name, x.website, x.members.length, "/team/" + x.id])
            } />
            {state.hasMore && <FlexRow>
                <Button disabled={state.loading} click={next}>Load More</Button>
            </FlexRow>}
        </>}
    </Page>;
};


export const UsersList = () => {
    //const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.USER);
    const [state, next] = usePaginated(ENDPOINTS.USER); 
    const { t } = useTranslation();

    return <Page
        title={t("user_plural")} vCentre={!!state.error}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>{t("lists.all_users")}</SectionTitle2>
            <br />
        </div>
        {state.error ? <>
            <FormError>
                {t("lists.users_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> : <>
            <Table headings={[t("name"), t("team")]} data={
                state.data.map(x => [x.username, x.team_name, "/profile/" + x.id])
            } />
            {state.hasMore && <FlexRow>
                <Button disabled={state.loading} click={next}>Load More</Button>
            </FlexRow>}
        </>}
    </Page>;
};
