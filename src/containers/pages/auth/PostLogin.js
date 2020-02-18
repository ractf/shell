import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import { Page, SectionTitle2, Button, ButtonRow, apiContext } from "ractf";
import { Wrap } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    const { t } = useTranslation();
    
    if (api.team) return <Redirect to={"/team"}/>;

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>{t("auth.welcome")}</SectionTitle2>
            <br />
            <div>{t("auth.next")}</div>
            <ButtonRow>
                <Button to={"/team/new"}>{t("create_a_team")}</Button>
                <Button to={"/team/join"}>{t("join_a_team")}</Button>
            </ButtonRow>
        </Wrap>
    </Page>;
};
