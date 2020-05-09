import React from "react";

import { FlashText, Spinner } from "@ractf/ui-kit";
import { registerPlugin, useApi } from "ractf";


const ChallengeServer = ({ challenge }) => {
    const [instance, error] = useApi("/challengeserver/instance/" + challenge.challenge_metadata.cserv_name);

    return <FlashText warning={!!error}>
        {error ? <div>Failed to request instance: {error}</div>
            : instance ? <div>Challenge instance ready at <code>
                {instance.ip}:{instance.port}
            </code></div> : <>
                    <div>Requesting challenge instance...</div>
                    <Spinner />
                </>}
    </FlashText>;
};


export default () => {
    registerPlugin("challengeMetadata", "challengeServer", {
        fields: [
            { label: "Challenge server settings:", type: "label" },
            { name: "cserv_name", label: "Challenge server name", type: "text" },
            { type: "hr" },
        ]
    });
    registerPlugin("challengeMod", "challengeServer", {
        component: ChallengeServer,
        check: (challenge) => !!challenge.challenge_metadata.cserv_name
    });
};
