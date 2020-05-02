import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, Spinner, SBTSection, Section, apiEndpoints, appContext,
    useApi, ENDPOINTS, FlexRow, FormGroup, Leader
} from "ractf";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [announcements] = useApi(ENDPOINTS.ANNOUNCEMENTS);
    const [localA, setLocalA] = useState(null);
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalA(announcements);
    }, [announcements]);

    const addAnnouncement = ({ title, body }) => {
        setLocked(true);
        endpoints.addAnnouncement(title, body).then(() => {
            setLocked(false);
            app.alert("Announcement posted");
        }).catch(e => {
            setLocked(false);
            app.alert(endpoints.getError(e));
        });
    };
    const remove = (announcement) => {
        return () => {
            endpoints.removeAnnouncement(announcement).then(() => {
                app.alert("Removed announcement");
                setLocalA(la => la.filter(i => i.id !== announcement.id));
            }).catch(e => {
                app.alert(endpoints.getError(e));
            });
        };
    };

    return <SBTSection title={t("admin.announce.head")}>
        <Section title={t("admin.announce.active")}>
            <Form>{localA ?
                localA.length ? (
                    localA.map(i => <Leader key={i.id} sub={i.body} x click={remove(i)}>
                        {i.title}
                    </Leader>
                )) : <label>{t("admin.announce.none")}</label>
                : <Spinner />
            }</Form>
        </Section>
        <Section title={t("admin.announce.add")}>
            <Form handle={addAnnouncement} locked={locked}>
                <FormGroup htmlFor={"title"} label={t("admin.announce.title")}>
                    <Input name={"title"} />
                </FormGroup>
                <FormGroup htmlFor={"body"} label={t("admin.announce.body")}>
                    <Input name={"body"} rows={4} />
                </FormGroup>
                <FlexRow>
                    <Button submit>{t("admin.announce.add")}</Button>
                </FlexRow>
            </Form>
        </Section>
    </SBTSection>;
};
