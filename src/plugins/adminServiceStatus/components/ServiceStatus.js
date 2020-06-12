import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from 'react-i18next';

import { SBTSection, Section } from "@ractf/ui-kit";
import { apiEndpoints } from "ractf";




export default () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([{
            "name": "Status has not yet been fetched",
            "status": "unknown",
            "details": ""
        }]);
    
    
    const endpoints = useContext(apiEndpoints);

    useEffect(() => {
        endpoints.getStatus(setServices);
        const interval = setInterval(() => {
            endpoints.getStatus(setServices);
        }, 15000);
        return () => clearInterval(interval);
    }, [endpoints, setServices]);

    return <SBTSection title={t("admin.status")}>
        {
        services.map((value, index) => {
            if (value.details === '') {
                return  <Section title={value.name}>
                            <div className={"absIndicator " + value.status} />
                        </Section>;
            } else {
                return  <Section title={value.name}>
                            <div className={"absIndicator " + value.status} />
                            <pre><code>{value.details}</code></pre>
                        </Section>;
            }
        })
        }
    </SBTSection>;
};