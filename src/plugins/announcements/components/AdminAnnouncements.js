// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Button, Spinner, Card, Row, FormGroup, Leader, PageHead
} from "@ractf/ui-kit";
import { appContext, useApi } from "ractf";
import { ENDPOINTS } from "@ractf/api";
import http from "@ractf/http";

import { addAnnouncement, removeAnnouncement } from "../api/announcements";


export default () => {
    const app = useContext(appContext);
    const [announcements] = useApi(ENDPOINTS.ANNOUNCEMENTS);
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
