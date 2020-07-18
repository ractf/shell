import React, { useState, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";

import { Button, Input, InputButton, Form, FormError, Row } from "@ractf/ui-kit";
import { attemptFlag, reloadAll } from "@ractf/api";
import { useConfig } from "@ractf/util";
import http from "@ractf/http";

import { appContext } from "ractf";


const FlagForm = ({ challenge, onFlagResponse, autoFocus, submitRef }) => {
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const flag_prefix = useConfig("flag_prefix", "flag");

    const app = useContext(appContext);

    const { t } = useTranslation();

    const escape = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flagRegex = () => {
        let regex = challenge.challenge_metadata.flag_regex;
        let partial = challenge.challenge_metadata.flag_partial_regex;
        let format_string;
        if (!regex || !partial) {
            regex = new RegExp("^" + escape(flag_prefix) + "{.+}$");
            partial = "";
            for (let i = 0; i < flag_prefix.length; i++) {
                partial += "(?:" + escape(flag_prefix[i]) + "|$)";
            }
            partial = new RegExp("^" + partial + "(?:{|$)(?:[^}]+|$)(?:}|$)$");
            format_string = flag_prefix + "{...}";
        } else {
            format_string = regex.toString();
        }
        return [regex, partial, format_string];
    };
    const [regex, partial, format_string] = flagRegex();

    const changeFlag = (flag) => {
        if (challenge.challenge_type === "freeform" || challenge.challenge_type === "longText")
            return setFlagValid(!!flag);
        setFlagValid(regex.test(flag));
    };

    const tryFlag = useCallback(({ flag }) => {
        setLocked(true);
        attemptFlag(flag, challenge).then(resp => {
            if (resp.correct) {
                app.alert("Flag correct!");
                if (onFlagResponse)
                    onFlagResponse(true);
                challenge.solved = true;

                // NOTE: This is potentially very slow. If there are performance issues in production, this is
                // where to look first!
                reloadAll();
                /*  // This is the start of what would be the code to rebuild the local cache
                api.challenges.forEach(group => group.chals.forEach(chal => {
                    if (chal.deps.indexOf(challenge.id) !== -1) {
                        chal.lock = false;
                    }
                }));
                */
            } else {
                app.alert("Incorrect flag");
            }
            setLocked(false);
        }).catch(e => {
            setMessage(http.getError(e));
            if (onFlagResponse)
                onFlagResponse(false, http.getError(e));
            setLocked(false);
        });
    }, [challenge, app, onFlagResponse]);

    if (submitRef) submitRef.current = tryFlag;

    let flagInput = null;
    let button = true;
    switch (challenge.challenge_type) {
        case "code":
            break;
        case "map":
            break;
        case "freeform":
            flagInput = <Input placeholder="Flag"
                name={"flag"} onChange={changeFlag}
                light monospace autoFocus={autoFocus}
                center width={"80%"} />;
            break;
        case "longText":
            flagInput = <Input rows={5} placeholder="Flag text"
                format={partial} name={"flag"} autoFocus={autoFocus}
                onChange={changeFlag} light monospace
                center width={"80%"} />;
            break;
        default:
            flagInput = <InputButton placeholder={"Flag format: " + format_string}
                format={partial} name={"flag"} autoFocus={autoFocus} center
                onChange={changeFlag} light monospace
                button={t("challenge.attempt")} btnDisabled={!flagValid} />;
            button = false;
            break;
    }

    return <Form handle={tryFlag} locked={locked}>
        {flagInput && <>
            {flagInput}
            {message && <FormError>{message}</FormError>}
            {button && <Row>
                <Button disabled={!flagValid} submit>{t("challenge.attempt")}</Button>
            </Row>}
        </>}
    </Form>;
};
export default React.memo(FlagForm);

