import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import { apiContext, Page, FormError, Spinner } from "ractf";
import { Wrap } from "./Parts";


export const EmailVerif = ({ location }) => {
    const [verif, setVerif] = useState(0);
    const [message, setMessage] = useState("");
    const api = useContext(apiContext);
    const uuid = window.location.search.substring(1, 37);

    useEffect(() => {
        api.verify(uuid).then(() => {
            setVerif(2);
        }).catch((e) => {
            setMessage(api.getError(e));
            setVerif(1);
        });
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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
                <Redirect to={"/noteam"}/>
            </> : null}
        </Wrap>
    </Page>;
}


export const EmailMessage = () => {
    return <Page vCentre>
        <Wrap>
            Thank you for registering!
            <br /><br />
            Please check your indox for a verification link.
            <br /><br />
            Make sure to check your spam folder if you can't find it!
        </Wrap>
    </Page>;
}
