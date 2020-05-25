import React from "react";
import { useTranslation } from 'react-i18next';

import { BrokenShards } from "./ErrorPages";

import {
    Page, Table, FormError, Button, Row, H2
} from "@ractf/ui-kit";
import { usePaginated, ENDPOINTS } from "ractf";


export const TeamsList = () => {
    //const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.TEAM);
    const [state, next] = usePaginated(ENDPOINTS.TEAM); 

    const { t } = useTranslation();

    return <Page
        title={t("team_plural")} vCentre={state.error}>
        <div style={{ textAlign: "center" }}>
            <H2>{t("lists.all_teams")}</H2>
            <br />
        </div>
        {state.error ? <>
            <FormError>
                {t("lists.teams_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> : <>
            <Table headings={[t("team"), t("members")]} data={
                state.data.map(x => [x.name, x.members, { link: "/team/" + x.id }])
            } />
            {state.hasMore && <Row>
                <Button disabled={state.loading} click={next}>Load More</Button>
            </Row>}
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
            <H2>{t("lists.all_users")}</H2>
            <br />
        </div>
        {state.error ? <>
            <FormError>
                {t("lists.users_error")}<br />{t("lists.try_reload")}
            </FormError>
            <BrokenShards />
        </> : <>
            <Table headings={[t("name"), t("team")]} data={
                state.data.map(x => [x.username, x.team_name, { link: "/profile/" + x.id }])
            } />
            {state.hasMore && <Row>
                <Button disabled={state.loading} click={next}>Load More</Button>
            </Row>}
        </>}
    </Page>;
};
