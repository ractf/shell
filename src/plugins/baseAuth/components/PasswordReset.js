import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";
import qs from "query-string";

import { useReactRouter } from "@ractf/util";
import {
    Form, FormError, Page, SectionTitle2, Input, Button, FormGroup, FlexRow
} from "@ractf/ui-kit";
import { apiEndpoints, appContext, zxcvbn } from "ractf";
import { Wrap } from "./Parts";


export default () => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [message, setMessage] = useState("");
    const [locked, setLocked] = useState(false);
    const { t } = useTranslation();

    const { location } = useReactRouter();
    const props = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (!(props.secret && props.id)) return <Redirect to={"/login"} />;

    const doReset = ({ passwd1, passwd2 }) => {
        if (passwd1 !== passwd2)
            return setMessage(t("auth.pass_match"));
        if (!passwd1)
            return setMessage(t("auth.no_pass"));

        const strength = zxcvbn()(passwd1);
        if (strength.score < 3)
            return setMessage((strength.feedback.warning || t("auth.pass_weak")));

        setLocked(true);
        endpoints.completePasswordReset(props.id, props.secret, passwd1).then(() => {
            app.alert(t("auth.pass_reset"));
        }).catch(
            message => {
                setMessage(endpoints.getError(message));
                setLocked(false);
            }
        );
    };

    return <Page vCentre>
        <Wrap>
            <Form locked={locked} handle={doReset}>
                <SectionTitle2>{t("auth.reset_password")}</SectionTitle2>

                <FormGroup>
                    <Input zxcvbn={zxcvbn()} name={"passwd1"} placeholder={t("new_pass")} password />
                    <Input name={"passwd2"} placeholder={t("password_repeat")} password />
                </FormGroup>

                {message && <FormError>{message}</FormError>}

                <FlexRow right>
                    <Button large submit>{t("auth.reset")}</Button>
                </FlexRow>
            </Form>
        </Wrap>
    </Page>;
};
