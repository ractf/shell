// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import { createChallenge, editChallenge, reloadAll, removeChallenge } from "@ractf/api";
import { PluginComponent, getPlugin } from "@ractf/plugins";
import { useChallenge, useCategory } from "@ractf/util/hooks";
import { useReactRouter } from "@ractf/util";
import { appContext } from "ractf";
import http from "@ractf/http";


const EditorWrap = ({ challenge, category, isCreator }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const app = useContext(appContext);
    let handler;

    if (challenge.challenge_type)
        handler = getPlugin("challengeEditor", challenge.challenge_type);
    else
        handler = getPlugin("challengeEditor", "default");

    while (handler && handler.uses)
        handler = getPlugin("challengeEditor", handler.uses);

    if (!handler || !handler.component)
        return <>
            {t("challenge.editor_missing", { type: challenge.challenge_type })}<br /><br />
            {t("challenge.forgot_plugin")}
        </>;


    const saveEdit = changes => {
        const original = challenge.toJSON();

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

        (isCreator ? createChallenge : editChallenge)({
            ...original, ...changes, id: (isCreator ? category.id : original.id), flag_metadata: flag
        }).then(async (data) => {
            for (const i in changes)
                original[i] = changes[i];
            if (isCreator) category.challenges.push(original);
            //if (lState.saveTo)
            //    lState.saveTo.push(original);

            const id = original.id || data.id;
            if (id && isCreator)
                dispatch(push(challenge.url + "#edit"));
            else
                dispatch(push(category.url + "#edit"));

            await reloadAll();
        }).catch(e => app.alert(http.getError(e)));
    };

    const doRemoveChallenge = () => {
        app.promptConfirm({ message: "Remove challenge:\n" + challenge.name, small: true }).then(() => {
            removeChallenge(challenge).then(() => {
                app.alert("Challenge removed");
                dispatch(push(category.url));
            }).catch(e => {
                app.alert("Error removing challenge:\n" + http.getError(e));
            });
        }).catch(() => { });
    };

    return React.createElement(handler.component, {
        challenge, category, isCreator: isCreator, saveEdit, removeChallenge: doRemoveChallenge
    });
};

const ChallengePage = () => {
    const { match } = useReactRouter();
    const catId = match.params.tabId;
    const chalId = match.params.chalId;

    const locationHash = useSelector(state => state.router?.location?.hash);
    const user = useSelector(state => state.user);

    const isEditor = locationHash === "#edit" && user && user.is_staff;
    const isCreator = chalId === "new" && user && user.is_staff;

    const category = useCategory(catId);
    let challenge = useChallenge(category, chalId);

    if (isCreator) {
        try {
            challenge = JSON.parse(decodeURIComponent(locationHash.substring(1)));
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
            chalEl = (
                <PluginComponent type={"challengeType"} name={challenge.challenge_type} fallback={"default"}
                    challenge={challenge} category={category} />
            );
    }

    return chalEl;
};
export default ChallengePage;
