import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { plugins, apiContext, appContext, apiEndpoints } from "ractf";


const EditorWrap = ({ challenge, category, isCreator }) => {
    const { history } = useReactRouter();
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);

    const { t } = useTranslation();
    let handler;
    
    if (challenge.challenge_type)
        handler = plugins.challengeEditor[challenge.challenge_type];
    else
        handler = plugins.challengeEditor["default"];

    while (handler && handler.uses)
        handler = plugins.challengeEditor[handler.uses];

    if (!handler || !handler.component)
        return <>
            {t("challenge.editor_missing", { type: challenge.challenge_type })}<br /><br />
            {t("challenge.forgot_plugin")}
        </>;
    

    const saveEdit = changes => {
        let original = challenge;

        let flag;
        try {
            flag = JSON.parse(changes.flag_metadata);
        } catch (e) {
            if (!changes.flag_metadata.length) flag = "";
            else return app.alert(t("challenge.invalid_flag_json"));
        }

        (isCreator ? endpoints.createChallenge : endpoints.editChallenge)({
            ...original, ...changes, id: (isCreator ? category.id : original.id), flag_metadata: flag
        }).then(async (data) => {
            for (let i in changes)
                original[i] = changes[i];
            if (isCreator) category.challenges.push(original);
                //if (lState.saveTo)
            //    lState.saveTo.push(original);
            
            let id = original.id || data.id;
            if (id && isCreator)
                history.push("/campaign/" + category.id + "/challenge/" + id + "#edit");
            else
                history.push("/campaign/" + category.id + "#edit");

            await endpoints.setup();
        }).catch(e => app.alert(endpoints.getError(e)));
    };

    const removeChallenge = () => {
        app.promptConfirm({message: "Remove challenge:\n" + challenge.name, small: true}).then(() => {
            endpoints.removeChallenge(challenge).then(() => {
                app.alert("Challenge removed");
                history.push("/campaign/" + category.id);
            }).catch(e => {
                app.alert("Error removing challenge:\n" + endpoints.getError(e));
            });
        }).catch(() => { });
    };

    return React.createElement(handler.component, {
        challenge, category, isCreator: isCreator, saveEdit, removeChallenge
    });
};

const ChallengeWrap = ({ challenge }) => {
    const { t } = useTranslation();
    let handler;

    if (challenge.challenge_type)
        handler = plugins.challengeType[challenge.challenge_type];
    else
        handler = plugins.challengeType["default"];

    if (!handler || !handler.component)
        return <>
            {t("challenge.renderer_missing", { type: challenge.challenge_type })}<br /><br />
            {t("challenge.forgot_plugin")}
        </>;

    if (handler.rightOf) {
        let parentHandler = plugins.challengeType[handler.rightOf];
        if (!parentHandler) {
            return <>
                {t("challenge.renderer_missing", { type: handler.rightOf })}<br /><br />
                {t("challenge.forgot_plugin")}
            </>;
        }
        return React.createElement(parentHandler.component, {
            rightComponent: handler.component,
            challenge: challenge,
        });
    }
    return React.createElement(handler.component, {
        challenge: challenge,
    });
};

export default () => {
    const { match, location } = useReactRouter();
    const catId = match.params.tabId;
    const chalId = match.params.chalId;

    const api = useContext(apiContext);

    const isEditor = location.hash === "#edit" && api.user && api.user.is_staff;
    const isCreator = chalId === "new" && api.user && api.user.is_staff;

    let category = (() => {
        for (let i in api.challenges) {
            if (api.challenges[i].id.toString() === catId.toString()) return api.challenges[i];
        }
    })();
    let challenge = (() => {
        if (!category) return null;
        let chals = category.challenges || [];
        for (let i in chals)
            if (chals[i].id.toString() === chalId.toString()) return chals[i];
    })();
    if (isCreator) {
        try {
            challenge = JSON.parse(decodeURIComponent(location.hash.substring(1)));
        } catch(e) {
            challenge = null;
        }
    }
    let chalEl;

    if (!category || !challenge) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />;
    }

    if (challenge) {
        if (isEditor || isCreator)
            chalEl = <EditorWrap {...{challenge, category, isCreator}} />;
        else
            chalEl = <ChallengeWrap {...{challenge}} />;
    }

    return <Page title={challenge ? challenge.name : "Challenges"}>
        {chalEl}
    </Page>;
};
