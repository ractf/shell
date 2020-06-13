import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import { api, http, plugins, appContext } from "ractf";
import { useReactRouter } from "@ractf/util";
import { Page } from "@ractf/ui-kit";


const EditorWrap = ({ challenge, category, isCreator }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const app = useContext(appContext);
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
        const original = challenge;

        let flag;
        if (typeof changes.flag_metadata === "object") {
            flag = changes.flag_metadata;
        } else {
            try {
                flag = JSON.parse(changes.flag_metadata);
            } catch (e) {
                if (!changes.flag_metadata.length) flag = "";
                else return app.alert(t("challenge.invalid_flag_json"));
            }
        }

        (isCreator ? api.createChallenge : api.editChallenge)({
            ...original, ...changes, id: (isCreator ? category.id : original.id), flag_metadata: flag
        }).then(async (data) => {
            for (const i in changes)
                original[i] = changes[i];
            if (isCreator) category.challenges.push(original);
            //if (lState.saveTo)
            //    lState.saveTo.push(original);

            const id = original.id || data.id;
            if (id && isCreator)
                dispatch(push("/campaign/" + category.id + "/challenge/" + id + "#edit"));
            else
                dispatch(push("/campaign/" + category.id + "#edit"));

            await api.reloadAll();
        }).catch(e => app.alert(http.getError(e)));
    };

    const removeChallenge = () => {
        app.promptConfirm({ message: "Remove challenge:\n" + challenge.name, small: true }).then(() => {
            api.removeChallenge(challenge).then(() => {
                app.alert("Challenge removed");
                dispatch(push("/campaign/" + category.id));
            }).catch(e => {
                app.alert("Error removing challenge:\n" + http.getError(e));
            });
        }).catch(() => { });
    };

    return React.createElement(handler.component, {
        challenge, category, isCreator: isCreator, saveEdit, removeChallenge
    });
};

const ChallengeWrap = ({ challenge, category }) => {
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
        const parentHandler = plugins.challengeType[handler.rightOf];
        if (!parentHandler) {
            return <>
                {t("challenge.renderer_missing", { type: handler.rightOf })}<br /><br />
                {t("challenge.forgot_plugin")}
            </>;
        }
        return React.createElement(parentHandler.component, {
            rightComponent: handler.component,
            challenge, category
        });
    }
    return React.createElement(handler.component, { challenge, category });
};

export default () => {
    const { match, location } = useReactRouter();
    const catId = match.params.tabId;
    const chalId = match.params.chalId;

    const categories = useSelector(state => state.challenges?.categories);
    const user = useSelector(state => state.user);

    const isEditor = location.hash === "#edit" && user && user.is_staff;
    const isCreator = chalId === "new" && user && user.is_staff;

    const category = (() => {
        for (const i in categories) {
            if (categories[i].id.toString() === catId.toString()) return categories[i];
        }
    })();
    let challenge = (() => {
        if (!category) return null;
        const chals = category.challenges || [];
        for (const i in chals)
            if (chals[i].id.toString() === chalId.toString()) return chals[i];
    })();
    if (isCreator) {
        try {
            challenge = JSON.parse(decodeURIComponent(location.hash.substring(1)));
        } catch (e) {
            challenge = null;
        }
    }
    let chalEl;

    if (!category || !challenge) {
        return <Redirect to={"/404"} />;
    }

    if (challenge) {
        if (isEditor || isCreator)
            chalEl = <EditorWrap {...{ challenge, category, isCreator }} />;
        else
            chalEl = <ChallengeWrap {...{ challenge, category }} />;
    }

    return <Page title={challenge ? challenge.name : "Challenges"}>
        {chalEl}
    </Page>;
};
