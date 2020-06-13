import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { api, http, appContext, useApi } from "ractf";
import {
    Form, Input, Button, Spinner, Card, Row, FormGroup, Leader, PageHead
} from "@ractf/ui-kit";

import { addAnnouncement, removeAnnouncement } from "../api/announcements";


export default () => {
    const app = useContext(appContext);
    const [announcements] = useApi(api.ENDPOINTS.ANNOUNCEMENTS);
    const [localA, setLocalA] = useState(null);
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalA(announcements);
    }, [announcements]);

    const add = ({ title, body }) => {
        setLocked(true);
        addAnnouncement(title, body).then(() => {
            setLocked(false);
            app.alert("Announcement posted");
        }).catch(e => {
            setLocked(false);
            app.alert(http.getError(e));
        });
    };
    const remove = (announcement) => {
        return () => {
            removeAnnouncement(announcement).then(() => {
                app.alert("Removed announcement");
                setLocalA(la => la.filter(i => i.id !== announcement.id));
            }).catch(e => {
                app.alert(http.getError(e));
            });
        };
    };

    return <>
        <PageHead title={t("admin.announce.head")} />
        <Row>
            <Card header={t("admin.announce.active")}>
                <Form>{localA ?
                    localA.length ? (
                        localA.map(i => <Row key={i.id}>
                            <Leader sub={i.body} x onClick={remove(i)}>
                                {i.title}
                            </Leader>
                        </Row>
                    )) : <label>{t("admin.announce.none")}</label>
                    : <Row><Spinner /></Row>
                }</Form>
            </Card>
        </Row>
        <Row>
            <Card header={t("admin.announce.add")}>
                <Form handle={add} locked={locked}>
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
