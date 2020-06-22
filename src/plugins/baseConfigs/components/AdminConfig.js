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
    Form, Input, Button, Row, HR, FormGroup, Checkbox, DatePick, PageHead,
    Column
} from "@ractf/ui-kit";
import { appContext, useApi, plugins } from "ractf";
import { ENDPOINTS, setConfigValue } from "@ractf/api";
import http from "@ractf/http";


export default () => {
    const app = useContext(appContext);
    const { t } = useTranslation();
    const [adminConfig, setAdminConfig] = useState(null);
    const [adminConfig_] = useApi(ENDPOINTS.CONFIG);

    useEffect(() => {
        if (adminConfig_) {
            const config = {};
            Object.entries(adminConfig_).forEach(([key, value]) => config[key] = value);
            setAdminConfig(config);
        }
    }, [adminConfig_]);

    const configSet = (key, value) => {
        setConfigValue(key, value).then(() => {
            setAdminConfig(oldConf => ({ ...oldConf, key: value }));
        }).catch(e => {
            console.error(e);
            app.alert(http.getError(e));
        });
    };
    const updateConfig = (changes) => {
        Object.entries(changes).forEach(([key, value]) => {
            if (value !== adminConfig[key]) configSet(key, value);
        });
    };

    const fields = [];
    let stack = [];
    let stack2 = [];

    const flushStack = () => {
        if (stack.length) {
            stack2.push(<Row left key={stack2.length}>{stack.map(i => i[0])}</Row>);
            stack = [];
        }
    };
    const flushStack2 = () => {
        if (stack2.length) {
            fields.push(<Column key={fields.length} width={6}>{stack2}</Column>);
            stack2 = [];
        }
    };

    if (adminConfig !== null) {
        Object.values(plugins.config).forEach(i => {
            i.forEach(([key, name, type, extra]) => {
                if (key === "" || (stack.length && type !== stack[0][1]))
                    flushStack();
                if (key === "") {
                    if (fields.length)
                        stack2.push(<HR key={stack2.length} />);
                    flushStack2();
                    if (name)
                        stack2.push(<div key={stack2.length}>{name}</div>);
                    return;
                }
                switch (type) {
                    case "string":
                    case "int":
                    case "float":
                        const format = (type === "string") ? null : (type === "int") ? /\d+/ : /\d+(\.\d+)?/;
                        stack.push([<FormGroup key={stack.length} label={name}>
                            <Input placeholder={name} val={adminConfig[key]} format={format} name={key} />
                        </FormGroup>, type]);
                        break;
                    case "date":
                        stack.push([<FormGroup key={stack.length} label={name}>
                            <DatePick initial={adminConfig[key]} configSet={configSet} configKey={key} />
                        </FormGroup>, type]);
                        break;
                    case "boolean":
                        stack.push([<Checkbox key={stack.length} name={key} val={adminConfig[key]}>
                            {name}
                        </Checkbox>, type]);
                        break;
                    default:
                        break;
                }
            });
            flushStack();
            flushStack2();
        });
    }

    return <>
        <PageHead title={t("admin.configuration")} />
        <Form handle={updateConfig}>
            <Row>
            {fields}
            </Row>
            <Row>
                <Button submit>Save</Button>
            </Row>
        </Form>
    </>;
};
