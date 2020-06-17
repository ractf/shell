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

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Card, Row, PageHead } from "@ractf/ui-kit";
import { makeClass } from "@ractf/util";
import { http, api } from "ractf";

import style from "./ServiceStatus.module.scss";

const getServiceStatus = (setter) => {
    http.get(api.ENDPOINTS.STATUS).then(
        response => setter(response)
    ).catch(
        error => setter([{
            "name": "An error was encountered whilst attempting to fetch status",
            "status": "offline",
            "details": ""
        }])
    );
};

export default () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([{
            "name": "Status has not yet been fetched",
            "status": "unknown",
            "details": ""
        }]);

    useEffect(() => {

        getServiceStatus(setServices);

        const interval = setInterval(() => {
            getServiceStatus(setServices);
        }, 15000);

        return () => clearInterval(interval);
    }, [setServices]);
    console.log(services);
    return <>
            <PageHead title={t("admin.status")} />
            {
            services.map((value, index) => {
                if (value.details === "") {
                    return <Row>
                                <Card header={value.name}>
                                    <div className={makeClass(style.indicator,
                                                value.status === "unknown" && style.unknown,
                                                value.status === "offline" && style.offline,
                                                value.status === "partial" && style.unknown,
                                                value.status === "online" && style.online,
                                            )} />
                                </Card>
                            </Row>;
                } else {
                    return  <Row>
                                <Card header={value.name}>
                                <div className={makeClass(style.indicator,
                                                value.status === "unknown" && style.unknown,
                                                value.status === "offline" && style.offline,
                                                value.status === "partial" && style.unknown,
                                                value.status === "online" && style.online,
                                            )} />
                                    <pre><code>{value.details}</code></pre>
                                </Card>
                            </Row>;
                }
            })
            }
            </>;
};