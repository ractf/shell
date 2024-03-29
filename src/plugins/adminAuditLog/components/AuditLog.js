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
    PageHead, Card, ModalSpinner, TreeWrap, TreeValue, Tree
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

    const RecursiveObjectTree = ({obj}) => 
        Object.entries(obj).map(([k, v]) => 
            typeof(v) === "object" ?
                <Tree name={k} startOpen>
                    <RecursiveObjectTree obj={v}/>
                </Tree> :
                <TreeValue name={k} value={String(v)}/>
        );

    const ObjectTree = ({obj}) => <TreeWrap>
        <RecursiveObjectTree obj={obj}/>
    </TreeWrap>;

    return <>
        <PageHead title={t("admin.audit_log.title")} />

        {items ?
            items.length ?
                items.map((item) => {
                    const details = item.extra;
                    details._username = item.username;

                    // Special-cased actions get handled first...
                    if (item.action === "set_config") {
                        // Don't ask why these checks exist, just accept that they do.
                        if (details.old_value === null && details.new_value === "") { return <></>; }
                        if (details.old_value === details.new_value)                { return <></>; }

                        return <Card header={t("admin.audit_log.heading_" + item.action)}>
                            {details._username} changed <code>{details.key}</code> from 
                            <code>{String(details.old_value)}</code> to <code>{String(details.new_value)}</code>.
                        </Card>;
                    
                    } else if (item.action === "update_model") {
                        return <Card header={t("admin.audit_log.heading_" + item.action)}>
                            {details._username} updated the following fields on a 
                            <code>{details.model_name}</code> with ID {details.model_id}: <br/>

                            <ObjectTree obj={details.updated_fields}/>
                        </Card>;
                    
                    } else if (item.action === "create_model") {
                        return <Card header={t("admin.audit_log.heading_" + item.action)}>
                            {details._username} created a <code>{details.model_name}</code>: <br/>

                            <ObjectTree obj={details.model_fields}/>
                        </Card>;
                    
                    } else if (item.action === "destroy_model") {
                        return <Card header={t("admin.audit_log.heading_" + item.action)}>
                            {details._username} deleted a <code>{details.model_name}</code> 
                            with ID {details.model_id} which had the following fields: <br/>

                            <ObjectTree obj={details.model_fields}/>
                       </Card>;

                    // ...Otherwise, fall back on translations.
                    } else {
                        return <Card header={t("admin.audit_log.heading_" + item.action)}>
                            {t("admin.audit_log.entry_" + item.action, details)}
                        </Card>;
                    }
                })
                : <Card>{t("admin.audit_log.empty")}</Card>
            : <ModalSpinner />
        }
    </>;
};
