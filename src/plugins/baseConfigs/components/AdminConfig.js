import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, FlexRow, HR, FormGroup, Checkbox, DatePick, SBTSection
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

    const flushStack = () => {
        if (stack.length) {
            fields.push(<FlexRow left key={fields.length}>{stack.map(i => i[0])}</FlexRow>);
            stack = [];
        }
    };

    if (adminConfig !== null) {
        Object.values(plugins.config).forEach(i => {
            i.forEach(([key, name, type, extra]) => {
                if (key === "" || (stack.length && type !== stack[0][1]))
                    flushStack();
                if (key === "") {
                    if (fields.length)
                        fields.push(<HR key={fields.length} />);
                    if (name)
                        fields.push(<div key={fields.length}>{name}</div>);
                    return;
                }
                switch (type) {
                    case "string":
                    case "int":
                    case "float":
                        if (type === "string") flushStack();
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
        });
    }

    return <SBTSection title={t("admin.configuration")}>
        <Form handle={updateConfig}>
            {fields}
            <FlexRow>
                <Button submit>Save</Button>
            </FlexRow>
        </Form>
    </SBTSection>;
};
