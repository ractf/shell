import React from "react";

import { Page, SectionTitle2, HR, Button, useApi, TextBlock, Table, ENDPOINTS } from "ractf";

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

    return <Page>
        <SectionTitle2>RACTF Debug Page:</SectionTitle2>
        <HR />
        <div><code>ractf/shell</code> version: <code>{__COMMIT_HASH__}</code></div>
        <div><code>ractf/backend</code> version: <code>{backendVersion && backendVersion.commit_hash}</code></div>
        <HR />
        <div>Cache size:
            <code>{cacheLen.toString()} bytes</code> / <code>{cacheDataLen} items</code>
        </div>
        <Button click={clearCache}>Clear API cache</Button>
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
