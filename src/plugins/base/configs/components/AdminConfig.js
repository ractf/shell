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

import React, { useCallback, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Button, Checkbox, DatePick, PageHead,
    Column, Card, UiKitModals, Container
} from "@ractf/ui-kit";
import { ENDPOINTS, setConfigValue } from "@ractf/api";
import { iteratePlugins } from "@ractf/plugins";
import { NUMBER_RE } from "@ractf/util";
import * as http from "@ractf/util/http";


const AdminConfig = () => {
    const modals = useContext(UiKitModals);
    const { t } = useTranslation();
    const [adminConfig, setAdminConfig] = useState(null);
    const [adminConfig_] = http.useApi(ENDPOINTS.CONFIG);

    useEffect(() => {
        if (adminConfig_) {
            const config = {};
            Object.entries(adminConfig_).forEach(([key, value]) => config[key] = value);
            setAdminConfig(config);
        }
    }, [adminConfig_]);

    const configSet = useCallback((key, value) => {
        return setConfigValue(key, value).then(() => {
            setAdminConfig(oldConf => ({ ...oldConf, key: value }));
        }).catch(e => {
            console.error(e);
            modals.alert(http.getError(e));
        });
    }, [modals]);
    const updateConfig = useCallback((changes) => {
        Promise.all(Object.entries(changes).map(([key, value]) => {
            if (value !== adminConfig[key])
                return configSet(key, value);
            return new Promise(resolve => resolve());
        })).then(() => {
            setAdminConfig({ ...adminConfig, ...changes });
            modals.alert("Config updated");
        }).catch(() => {
            modals.alert("Failed to update config");
        });
    }, [adminConfig, modals, configSet]);

    const fields = [];

    if (adminConfig !== null) {
        iteratePlugins("config").forEach(({ plugin }) => {
            Object.keys(plugin).forEach((key) => {
                const fieldTypes = {};
                plugin[key].forEach((i) => {
                    fieldTypes[i[2]] ? fieldTypes[i[2]].push(i) : fieldTypes[i[2]] = [i];
                });
                fields.push(
                    <Card  lesser header={key}>
                        {Object.values(fieldTypes).map((fields) =>
                            <Form.Row>
                                {fields.map(([key, name, type, extra], i) => {
                                    switch (type) {
                                        case "string":
                                        case "int":
                                        case "float":
                                            const format = (
                                                (type === "string") ? null :
                                                    (type === "int") ? NUMBER_RE : /\d+(\.\d+)?/
                                            );
                                            return <Form.Group key={i} label={name}>
                                                <Input placeholder={name} val={adminConfig[key]}
                                                    format={format} name={key} />
                                            </Form.Group>;
                                        case "date":
                                            return <Form.Group key={i} label={name}>
                                                <DatePick initial={adminConfig[key]} configSet={configSet}
                                                    configKey={key} />
                                            </Form.Group>;
                                        case "boolean":
                                            return <Checkbox key={i} name={key} val={adminConfig[key]}>
                                                {name}
                                            </Checkbox>;
                                        default:
                                            return <></>;
                                    }
                                })}
                            </Form.Row>
                        )}
                    </Card>
                );
            });
        });
    }

    return <>
        <PageHead title={t("admin.configuration")} />
        <Form handle={updateConfig}>
            <Container.Row>
                <Column lgWidth={6} mdWidth={12}>
                    {fields.filter((_, i) => (i % 2) === 0)}
                </Column>
                <Column lgWidth={6} mdWidth={12}>
                    {fields.filter((_, i) => (i % 2) === 1)}
                </Column>
            </Container.Row>
            <Button submit>Save</Button>
        </Form>
    </>;
};

export default AdminConfig;
