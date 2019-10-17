import React, { useState } from "react";

import { Page, FormError, SectionTitle2, Button, ButtonRow, Spinner } from "ractf";
import { Wrap } from "./Parts";


export const EmailVerif = () => {
    const [verif, setVerif] = useState(0);

    setTimeout(() => {
        setVerif(2)
    }, 3000)

    return <Page vCentre>
        <Wrap>
            {verif === 0 ? <>
                <div>Verifying your account...</div>
                <Spinner />
            </> : verif === 1 ? <>
                <FormError>Account verification failed!</FormError>
            </> : verif === 2 ? <>
                <SectionTitle2>
                    Welcome to RACTF!
                </SectionTitle2>
                <div>Where to now, chief?</div>
                <ButtonRow>
                    <Button to={"/team/new"}>Create a Team</Button>
                    <Button to={"/team/join"}>Join a Team</Button>
                </ButtonRow>
            </> : null}
        </Wrap>
    </Page>;
}


export const EmailMessage = () => {
    return <Page vCentre>
        <Wrap>
            Thank you for registering!
            <br/><br/>
            Please check your indox for a verification link.
            <br/><br/>
            Make sure to check your spam folder if you can't find it!
        </Wrap>
    </Page>;
}
