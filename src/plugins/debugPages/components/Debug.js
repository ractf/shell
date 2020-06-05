import React from "react";

import {
    Page, HR, Button, TextBlock, Table, Row, H2
} from "@ractf/ui-kit";
import { ENDPOINTS, useApi } from "ractf";


export default () => {
    const [backendVersion] = useApi(ENDPOINTS.VERSION);

    const clearCache = () => {
        localStorage.setItem("apiCache", "{}");
        window.location.reload();
    };
    let apiCache = localStorage.getItem("apiCache");
    let cacheLen = apiCache === null ? 0 : apiCache.toString().length;
    let cacheData, cacheDataLen, challenges, config, countdown;
    try {
        cacheData = JSON.parse(apiCache);
        cacheDataLen = Object.keys(cacheData).length.toString();
    } catch (e) {
        cacheData = {};
        cacheDataLen = "0";
    }
    try {
        challenges = JSON.stringify(JSON.parse(localStorage.getItem("challenges")), null, 2);
    } catch (e) {
        challenges = "";
    }
    try {
        config = JSON.stringify(JSON.parse(localStorage.getItem("config")), null, 2);
    } catch (e) {
        config = "";
    }
    try {
        countdown = JSON.stringify(JSON.parse(localStorage.getItem("countdown")), null, 2);
    } catch (e) {
        countdown = "";
    }

    const download = (data, filename) => {
        let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8;" });
        if (navigator.msSaveBlob)
            return navigator.msSaveBlob(blob, filename);
    
        let elem = document.createElement("a");
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
            "versions": {
                "shell": __COMMIT_HASH__,
                "backend": backendVersion && backendVersion.commit_hash
            },
            "cache": {
                "size": {
                    "bytes": cacheLen,
                    "items": cacheDataLen
                },
                "items": cacheData
            },
            "config": JSON.parse(config),
            "countdown": JSON.parse(countdown),
            "challenges": JSON.parse(challenges)
        };
        download(debugExport, "debug.json");
    };

    return <Page>
        <H2>RACTF Debug Page:</H2>
        <HR />
        <div><code>ractf/shell</code> version: <code>{__COMMIT_HASH__}</code></div>
        <div><code>ractf/backend</code> version: <code>{backendVersion && backendVersion.commit_hash}</code></div>
        <HR />
        <div>Cache size:
            <code>{cacheLen.toString()} bytes</code> / <code>{cacheDataLen} items</code>
        </div>
        <Row>
            <Button onClick={clearCache}>Clear API cache</Button>
            <Button onClick={exportData}>Export debug data</Button>
        </Row>
        <div>
            <br />
            <Table headings={["Endpoint", "Data"]}
                data={Object.keys(cacheData).map(i => [
                    <code>{i}</code>, <code>{JSON.stringify(cacheData[i])}</code>
                ])} />
        </div>
        <HR />
        <div>Config:</div>
        <TextBlock className={"monospaced"}>
            {config}
        </TextBlock>
        <HR />
        <div>Countdown:</div>
        <TextBlock className={"monospaced"}>
            {countdown}
        </TextBlock>
        <HR />
        <div>Challenges:</div>
        <TextBlock className={"monospaced"}>
            {challenges}
        </TextBlock>
    </Page>;
};
