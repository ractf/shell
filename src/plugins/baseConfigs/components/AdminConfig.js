import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, Row, HR, FormGroup, Checkbox, DatePick, PageHead,
    Column
} from "@ractf/ui-kit";
import { apiContext, apiEndpoints, appContext, useApi, plugins, ENDPOINTS } from "ractf";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const { t } = useTranslation();
    const [adminConfig, setAdminConfig] = useState(null);
    const [adminConfig_] = useApi(ENDPOINTS.CONFIG);

    useEffect(() => {
        if (adminConfig_) {
            let config = {};
            Object.entries(adminConfig_).forEach(([key, value]) => config[key] = value);
            setAdminConfig(config);
        }
    }, [adminConfig_]);

    const configSet = (key, value) => {
        endpoints.setConfigValue(key, value).then(() => {
            if (api.config)
                api.config[key] = value;
            setAdminConfig(oldConf => ({ ...oldConf, key: value }));
        }).catch(e => {
            console.error(e);
            app.alert(endpoints.getError(e));
        });
    };
    const updateConfig = (changes) => {
        Object.entries(changes).forEach(([key, value]) => {
            if (value !== adminConfig[key]) configSet(key, value);
        });
    };

    let fields = [];
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
                        let format = (type === "string") ? null : (type === "int") ? /\d+/ : /\d+(\.\d+)?/;
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
                        stack.push([<Checkbox key={stack.length} name={key} checked={adminConfig[key]}>
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
