import React from "react";
import { useTranslation } from 'react-i18next';

import {SBTSection, Section} from "ractf";


export default () => {
    const { t } = useTranslation();

    return <SBTSection title={t("admin.status")}>
        <Section title={"Code Ingest"}>
            <div className={"absIndicator unknown"} />
        </Section>
        <Section title={"Mail Daemon"}>
            <div className={"absIndicator online"} />
        </Section>
        <Section title={"Cespit"}>
            <div className={"absIndicator offline"} />
        </Section>
        <Section title={"Staging"}>
            <div className={"absIndicator partial"} />
        </Section>
    </SBTSection>;
};
