// Copyright (C) 2020-2022 Really Awesome Technology Ltd
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

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { auditLog } from "@ractf/api";
import {
    PageHead, Card, ModalSpinner
} from "@ractf/ui-kit";


export default () => {
    const { t } = useTranslation();
    const [items, setItems] = useState(null);


    const loadItems = () => {
        auditLog().then((items) => {
            setItems(items);
        });
    };

    useEffect(() => {
        loadItems();
    }, []);

    return <>
        <PageHead title={t("admin.audit_log.title")} />

        {items ?
            items.length ?
                items.map((item) => {
                    const details = item.extra;
                    details._username = item.username;
                    return <Card header={t("admin.audit_log.heading_" + item.action)}>
                        {t("admin.audit_log.entry_" + item.action, details)}
                    </Card>;
                })
                : <Card>{t("admin.audit_log.empty")}</Card>
            : <ModalSpinner />
        }
    </>;
};
