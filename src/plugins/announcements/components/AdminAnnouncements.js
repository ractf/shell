// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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
    Form, Input, Button, Spinner, Card, Leader, PageHead,
    Column, UiKitModals, Container
} from "@ractf/ui-kit";
import * as http from "@ractf/util/http";
import { ENDPOINTS } from "@ractf/api";

import { addAnnouncement, removeAnnouncement } from "../api/announcements";


export default () => {
    const modals = useContext(UiKitModals);
    const [announcements] = http.useApi(ENDPOINTS.ANNOUNCEMENTS);
    const [localA, setLocalA] = useState(null);
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setLocalA(announcements);
    }, [announcements]);

    const add = ({ title, body }) => {
        setLocked(true);
        addAnnouncement(title, body).then(data => {
            setLocked(false);
            modals.alert("Announcement posted");
            setLocalA(oldLocalA => [...oldLocalA, data]);
        }).catch(e => {
            setLocked(false);
            modals.alert(http.getError(e));
        });
    };
    const remove = (announcement) => {
        return () => {
            removeAnnouncement(announcement).then(() => {
                modals.alert("Removed announcement");
                setLocalA(la => la.filter(i => i.id !== announcement.id));
            }).catch(e => {
                modals.alert(http.getError(e));
            });
        };
    };

    return <>
        <PageHead title={t("admin.announce.head")} />
        <Container.Row>
            <Column lgWidth={6} mdWidth={12}>
                <Card lesser header={t("admin.announce.active")}>
                    <Form>{localA ?
                        localA.length ? (
                            localA.map(i => (
                                <Leader sub={i.body} key={i.id} x onClick={remove(i)}>
                                    {i.title}
                                </Leader>
                            ))) : <label>{t("admin.announce.none")}</label>
                        : <Spinner />
                    }</Form>
                </Card>
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                <Card lesser header={t("admin.announce.add")}>
                    <Form handle={add} locked={locked}>
                        <Form.Group htmlFor={"title"} label={t("admin.announce.title")}>
                            <Input name={"title"} />
                        </Form.Group>
                        <Form.Group htmlFor={"body"} label={t("admin.announce.body")}>
                            <Input name={"body"} rows={4} />
                        </Form.Group>
                        <Button submit>{t("admin.announce.add")}</Button>
                    </Form>
                </Card>
            </Column>
        </Container.Row>
    </>;
};
