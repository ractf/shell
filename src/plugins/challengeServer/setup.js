import React, { useState, useEffect, useContext } from "react";

import { FlashText, Spinner, Button } from "@ractf/ui-kit";
import { registerPlugin, apiEndpoints, useApi } from "ractf";


const ChallengeServer = ({ challenge }) => {
    const [state, setState] = useState({});
    const api = useContext(apiEndpoints);
    const [instance_, error_, abort_] = useApi("/challengeserver/instance/" + challenge.challenge_metadata.cserv_name);

    useEffect(() => {
        setState({ instance: instance_, error: error_ });
    }, [instance_, error_]);

    const reset = () => {
        abort_();
        setState({ instance: null, error: null });
        api.get("/challengeserver/reset/" + challenge.challenge_metadata.cserv_name).then(({ d }) => {
            setState({ instance: d, error: null });
        }).catch(e => {
            setState({ instance: null, error: api.getError(e) });
        });
    };

    const button = (state.error || !state.instance) ? null : <Button large lesser click={reset}>
        Reset
    </Button>;

    return <FlashText warning={!!state.error} button={button}>
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
