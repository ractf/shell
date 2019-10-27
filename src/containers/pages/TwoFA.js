import React, { useContext, useState } from "react";
import QRCode from "qrcode.react";

import { Page, ButtonRow, Button, Spinner, SectionTitle2, TextBlock, FormError, apiContext, appContext} from "ractf";

import { Wrap } from "./auth/Parts";


export default () => {
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const [page, setPage] = useState(0);
    const [secret, setSecret] = useState('');
    const [message, setMessage] = useState(null)

    const startFlow = () => {
        setPage(1);

        api.add_2fa().then(resp => {
            setSecret(resp.d.totp_secret);
            setPage(2);   
        }).catch(() => {
            setPage(-1);
        })

        setTimeout(() => {
            setPage(2)
        }, 500);
    };

    const faPrompt = () => {
        app.promptConfirm({message: "2-Factor Code Required", small: true},
                        [{name: 'pin', placeholder: '6-digit code', format: /^\d{6}$/, limit: 6}]).then(({ pin }) => {
            if (pin.length !== 6) return faPrompt();

            api.verify_2fa(pin).then(async resp => {
                await api._reloadCache();
                setPage(3);
            }).catch(e => {
                console.error(e);
                setMessage("Code validation failed.")
            });
        }).catch(() => {
            setMessage("Unable to activate two-factor authentication.")
        });
    }

    const buildURI = sec => {
        return `otpauth://totp/RACTF:${api.user.username}?secret=${sec}&issuer=RACTF`
    };

    const formatSecret = sec => {
        return sec.substring(0, 4) + " " + sec.substring(4, 8) + " " + sec.substring(8, 12) + " " + sec.substring(12, 16);
    }
    
    return <Page title={"2-Factor Authentication"}>
        <Wrap>
            { page === 0 ? <>
                { api.user["2fa_status"] === "on" ?
                    "You are about to replace the existing 2-factor authentication keys for your account!"
                    : "You are about to enable 2-factor authentication for you account."}
                <br /><br />
                <b>
                    Note that once added, 2-factor cannot be removed from your account!
                </b>

                <ButtonRow>
                    <Button to={"/"} lesser>Nevermind</Button>
                    <Button click={startFlow}>Enable 2FA</Button>
                </ButtonRow>
            </> : page === 1 ? <>
                Enabling 2-Factor...
                <Spinner/>
            </> : page === 2 ? <>
                <SectionTitle2>Finalise Setup</SectionTitle2>
                <br/>
                Please scan the QR code below to add RACTF to your 2-factor app.
                <br/><br/>
                <QRCode renderAs={"svg"} size={128} fgColor={"#161422"} value={buildURI(secret)} includeMargin />
                <br /><br />
                If you are unable to scan the code, use the key shown below:
                <TextBlock>
                    { formatSecret(secret) }
                </TextBlock>

                {message && <FormError>{message}</FormError>}

                <Button click={faPrompt}>I've got it</Button>
            </> : page === 3 ? <>
                <SectionTitle2>Congratulations!</SectionTitle2>
                Two-factor authentication has been setup!
                <Button to={"/"}>Yay!</Button>
            </> : <>
                Something went wrong when setting up two-factor authentication.

                <Button click={() => setPage(0)}>Restart</Button>
            </>}
        </Wrap> 
    </Page>;
}
