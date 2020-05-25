import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import { H2, Page, Button, Row } from "@ractf/ui-kit";
import { apiContext } from "ractf";
import { Wrap } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    const { t } = useTranslation();
    
    if (api.team) return <Redirect to={"/team"}/>;

    return <Page vCentre>
        <Wrap>
            <H2>{t("auth.welcome")}</H2>
            <br />
            <div>{t("auth.next")}</div>
            <Row>
                <Button to={"/team/new"}>{t("create_a_team")}</Button>
                <Button to={"/team/join"}>{t("join_a_team")}</Button>
            </Row>
        </Wrap>
    </Page>;
};
