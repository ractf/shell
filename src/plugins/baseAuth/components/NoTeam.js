import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { H2, Page, Button, Row } from "@ractf/ui-kit";
import { Wrap } from "./Parts";


export default () => {
    const { t } = useTranslation();
    const team = useSelector(state => state.team);
    
    if (team) return <Redirect to={"/team"}/>;

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
