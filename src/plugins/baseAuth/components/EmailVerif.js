import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import qs from "query-string";

import { useReactRouter } from "@ractf/util";
import { Page, Spinner, FormError } from "@ractf/ui-kit";
import { apiEndpoints } from "ractf";
import { Wrap } from "./Parts";


export const EmailVerif = () => {
    const [verif, setVerif] = useState(0);
    const [message, setMessage] = useState("");
    const endpoints = useContext(apiEndpoints);

    const { location } = useReactRouter();
    const props = qs.parse(location.search, { ignoreQueryPrefix: true });
    const id = props.id;
    const secret = props.secret;

    useEffect(() => {
        endpoints.verify(id, secret).then(() => {
            setVerif(2);
        }).catch((e) => {
            setMessage(endpoints.getError(e));
            setVerif(1);
        });
    }, [endpoints, setVerif, setMessage, id, secret]);
    if (!(secret && id)) return <Redirect to={"/login"} />;

    return <Page vCentre>
        <Wrap>
            {verif === 0 ? <>
                <div>Verifying your account...</div>
                <Spinner />
            </> : verif === 1 ? <>
                <FormError>Account verification failed!</FormError>
                <br />
                <FormError>{message}</FormError>
            </> : verif === 2 ? <>
                <Redirect to={"/noteam"} />
            </> : null}
        </Wrap>
    </Page>;
};


export const EmailMessage = () => {
    return <Page vCentre>
        <Wrap>
            Thank you for registering!
            <br /><br />
            Please check your inbox for a verification link.
            <br /><br />
            Make sure to check your spam folder if you can't find it!
        </Wrap>
    </Page>;
};
