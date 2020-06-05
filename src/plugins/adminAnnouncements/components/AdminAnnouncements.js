import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, Spinner, Card, Row, FormGroup, Leader, PageHead
} from "@ractf/ui-kit";
import { apiEndpoints, appContext, useApi, ENDPOINTS } from "ractf";


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

    return <>
        <PageHead title={t("admin.announce.head")} />
        <Row>
            <Card header={t("admin.announce.active")}>
                <Form>{localA ?
                    localA.length ? (
                        localA.map(i => <Row>
                            <Leader key={i.id} sub={i.body} x onClick={remove(i)}>
                                {i.title}
                            </Leader>
                        </Row>
                    )) : <label>{t("admin.announce.none")}</label>
                    : <Spinner />
                }</Form>
            </Card>
        </Row>
        <Row>
            <Card header={t("admin.announce.add")}>
                <Form handle={addAnnouncement} locked={locked}>
                    <FormGroup htmlFor={"title"} label={t("admin.announce.title")}>
                        <Input name={"title"} />
                    </FormGroup>
                    <FormGroup htmlFor={"body"} label={t("admin.announce.body")}>
                        <Input name={"body"} rows={4} />
                    </FormGroup>
                    <Row>
                        <Button submit>{t("admin.announce.add")}</Button>
                    </Row>
                </Form>
            </Card>
        </Row>
    </>;
};
