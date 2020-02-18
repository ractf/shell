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
            if (api.challenges[i].id === tabId) return api.challenges[i];
        }
    })();
    let challenge = (() => {
        if (!tab) return null;
        for (let i in tab.chals)
            if (tab.chals[i].id === chalId) return tab.chals[i];
    })();
    let chalEl, handler;

    if (!tab || !challenge) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />;
    }

    handler = plugins.categoryType[tab.type];
    if (challenge) {
        if (challenge.type)
            handler = plugins.challengeType[challenge.type];
        else
            handler = plugins.challengeType["__default"];

        if (!handler)
            chalEl = <>
                {t("challenge.renderer_missing", {type: challenge.type})}<br /><br />
                {t("challenge.forgot_plugin")}
            </>;
        else {
            chalEl = React.createElement(
                handler.component, {
                challenge: challenge,
            });
        }
    }

    return <Page title={challenge ? challenge.name : "Challenges"}>
        {chalEl}
    </Page>;
};
