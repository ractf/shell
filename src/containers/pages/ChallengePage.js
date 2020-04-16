import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { plugins, apiContext } from "ractf";


export default () => {
    const { match } = useReactRouter();
    const tabId = match.params.tabId;
    const chalId = match.params.chalId;
    const { t } = useTranslation();

    const api = useContext(apiContext);

    let tab = (() => {
        for (let i in api.challenges) {
            if (api.challenges[i].id.toString() === tabId.toString()) return api.challenges[i];
        }
    })();
    let challenge = (() => {
        if (!tab) return null;
        let chals = tab.challenges || [];
        for (let i in chals)
            if (chals[i].id.toString() === chalId.toString()) return chals[i];
    })();
    let chalEl, handler;

    if (!tab || !challenge) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />;
    }

    if (challenge) {
        if (challenge.challenge_type)
            handler = plugins.challengeType[challenge.challenge_type];
        else
            handler = plugins.challengeType["default"];

        if (!handler)
            chalEl = <>
                {t("challenge.renderer_missing", {type: challenge.challenge_type})}<br /><br />
                {t("challenge.forgot_plugin")}
            </>;
        else {
            if (handler.rightOf) {
                let parentHandler = plugins.challengeType[handler.rightOf];
                if (!parentHandler) {
                    chalEl = <>
                        {t("challenge.renderer_missing", {type: handler.rightOf})}<br /><br />
                        {t("challenge.forgot_plugin")}
                    </>;
                } else {
                    chalEl = React.createElement(
                        parentHandler.component, {
                            rightComponent: handler.component,
                            challenge: challenge,
                        }
                    );
                }
            } else {
                chalEl = React.createElement(
                    handler.component, {
                        challenge: challenge,
                    }
                );
            }
        }
    }

    return <Page title={challenge ? challenge.name : "Challenges"}>
        {chalEl}
    </Page>;
};
