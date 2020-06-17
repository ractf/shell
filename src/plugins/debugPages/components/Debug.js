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

import React from "react";

import {
    Page, HR, Button, TextBlock, Row, H2
} from "@ractf/ui-kit";
import { api, useApi } from "ractf";
import { store } from "store";


export default () => {
    const [backendVersion] = useApi(api.ENDPOINTS.VERSION);

    const state = store.getState();
    const challenges = state.challenges?.categories;
    const countdowns = state.countdowns;
    const config = state.config;

    const download = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
        if (navigator.msSaveBlob)
            return navigator.msSaveBlob(blob, filename);
    
        const elem = document.createElement("a");
        elem.style = "display: none";
        elem.href = URL.createObjectURL(blob);
        elem.target = "_blank";
        elem.setAttribute("download", filename);
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    };

    const exportData = () => {
        const debugExport = {
            versions: {
                shell: __COMMIT_HASH__,
                backend: backendVersion && backendVersion.commit_hash
            },
            config, countdowns, challenges,
        };
        download(debugExport, "debug.json");
    };

    return <Page>
        <H2>RACTF Debug Page:</H2>
        <HR />
        <div><code>ractf/shell</code> version: <code>{__COMMIT_HASH__}</code></div>
        <div><code>ractf/backend</code> version: <code>{backendVersion && backendVersion.commit_hash}</code></div>
        <HR />
        <Row>
            <Button onClick={exportData}>Export debug data</Button>
        </Row>
        <HR />
        <div>Config:</div>
        <TextBlock className={"monospaced"}>
            {JSON.stringify(config, "", 2)}
        </TextBlock>
        <HR />
        <div>Countdowns:</div>
        <TextBlock className={"monospaced"}>
            {JSON.stringify(countdowns, "", 2)}
        </TextBlock>
        <HR />
        <div>Challenges:</div>
        <TextBlock className={"monospaced"}>
            {JSON.stringify(challenges, "", 2)}
        </TextBlock>
    </Page>;
};
