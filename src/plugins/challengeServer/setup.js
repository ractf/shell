import React, { useState, useEffect } from "react";

import { api, http, registerPlugin, useApi } from "ractf";
import { FlashText, Spinner, Button } from "@ractf/ui-kit";

const ChallengeServer = ({ challenge }) => {
    const [state, setState] = useState({});
    const [instance_, error_, abort_] = useApi("/challengeserver/instance/" + challenge.challenge_metadata.cserv_name);

    useEffect(() => {
        setState({ instance: instance_, error: error_ });
    }, [instance_, error_]);

    const reset = () => {
        abort_();
        setState({ instance: null, error: null });
        http.get("/challengeserver/reset/" + challenge.challenge_metadata.cserv_name).then(data => {
            setState({ instance: data, error: null });
        }).catch(e => {
            setState({ instance: null, error: api.getError(e) });
        });
    };

    const button = (state.error || !state.instance) ? null : <Button large lesser onClick={reset}>
        Reset
    </Button>;

    return <FlashText danger={!!state.error} button={button}>
        {state.error ? <div>Failed to request instance: {state.error}</div>
            : state.instance ? <div>Challenge instance ready at <code>
                {state.instance.ip}:{state.instance.port}
            </code>.</div> : <>
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
