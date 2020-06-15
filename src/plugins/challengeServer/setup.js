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
