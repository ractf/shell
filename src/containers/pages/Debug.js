import React, { useContext, useEffect } from "react";

import { SectionTitle2, HR, Code, apiContext } from "ractf";

export default () => {
    const api = useContext(apiContext);
    useEffect(() => {
        api.ensure("backendVersion");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <SectionTitle2>RACTF Debug Versions:</SectionTitle2>
        <HR />
        <div><Code>ractf/shell</Code> version: <Code>{__COMMIT_HASH__}</Code></div>
        <div><Code>ractf/backend</Code> version: <Code>{api.backendVersion && api.backendVersion.commit_hash}</Code></div>
    </>;
}
