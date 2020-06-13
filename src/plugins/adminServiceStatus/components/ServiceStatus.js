import React from "react";
import { useTranslation } from "react-i18next";

import { Card, Row, PageHead } from "@ractf/ui-kit";


export default () => {
    const { t } = useTranslation();

    return <>
        <PageHead title={t("admin.status")} />
        <Row>
            <Card header={"Code Ingest"}>
                <div className={"absIndicator unknown"} />
            </Card>
        </Row>
        <Row>
            <Card header={"Mail Daemon"}>
                <div className={"absIndicator online"} />
            </Card>
        </Row>
        <Row>
            <Card header={"Cespit"}>
                <div className={"absIndicator offline"} />
            </Card>
        </Row>
        <Row>
            <Card header={"Staging"}>
                <div className={"absIndicator partial"} />
            </Card>
        </Row>
    </>;
};
