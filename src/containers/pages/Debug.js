import React, { useContext, useEffect } from "react";

import { SectionTitle2, HR, apiContext } from "ractf";

export default () => {
    const api = useContext(apiContext);
    useEffect(() => {
        api.ensure("backendVersion");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <SectionTitle2>RACTF Debug Versions:</SectionTitle2>
        <HR />
        <div><code>ractf/shell</code> version: <code>{__COMMIT_HASH__}</code></div>
        <div><code>ractf/backend</code> version: <code>{api.backendVersion && api.backendVersion.commit_hash}</code></div>
    </>;
}
