// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { createChallenge, editChallenge, reloadAll, removeChallenge } from "@ractf/api";
import { PluginComponent, getPlugin } from "@ractf/plugins";
import { Challenge, useChallenge, useCategory } from "@ractf/shell-util";
import { useReactRouter } from "@ractf/util";
import { UiKitModals } from "@ractf/ui-kit";
import * as http from "@ractf/util/http";

import { push } from "connected-react-router";


const EditorWrap = ({ challenge, category, isCreator, embedded }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const modals = useContext(UiKitModals);
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
        const original = (challenge.toJSON ? challenge.toJSON() : { ...challenge });

        let flag;
        if (typeof changes.flag_metadata === "object") {
            flag = changes.flag_metadata;
        } else {
            try {
                flag = JSON.parse(changes.flag_metadata);
            } catch (e) {
                if (!changes.flag_metadata.length) flag = "";
                else return modals.alert(t("challenge.invalid_flag_json"));
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
                dispatch(push((new Challenge(category, { ...original, ...data })).url));
            else
                dispatch(push(category.url + "#edit"));

            await reloadAll();
        }).catch(e => modals.alert(http.getError(e)));
    };

    const doRemoveChallenge = () => {
        modals.promptConfirm({ message: "Remove challenge:\n" + challenge.name, small: true }).then(() => {
            removeChallenge(challenge).then(() => {
                modals.alert("Challenge removed");
                dispatch(push(category.url));
            }).catch(e => {
                modals.alert("Error removing challenge:\n" + http.getError(e));
            });
        }).catch(() => { });
    };

    return React.createElement(handler.component, {
        challenge, category, embedded, isCreator, saveEdit, removeChallenge: doRemoveChallenge
    });
};

const ChallengePage = ({ tabId, chalId, chalData, embedded }) => {
    const { match } = useReactRouter();
    embedded = (
        embedded
        || typeof tabId !== "undefined"
        || typeof chalId !== "undefined"
        || typeof chalData !== "undefined"
    );

    const catId = typeof tabId === "undefined" ? match.params.tabId : tabId;
    chalId = typeof chalId === "undefined" ? match.params.chalId : chalId;

    const locationHash = useSelector(state => state.router?.location?.hash);
    const user = useSelector(state => state.user);

    const isEditor = locationHash === "#edit" && user && user.is_staff;
    const isCreator = chalId === "new" && user && user.is_staff;

    const category = useCategory(catId);
    let challenge = useChallenge(category, chalId);

    if (isCreator) {
        try {
            challenge = (typeof chalData === "undefined"
                ? JSON.parse(decodeURIComponent(locationHash.substring(1)))
                : chalData
            );
        } catch (e) {
            challenge = {};
        }
        challenge.challenge_metadata = challenge.challenge_metadata || {};
        challenge = new Challenge(category, challenge);
    } else if (!challenge) return <Redirect to={"/404"} />;
    // Brand new challenge; wait for it to populate
    if (!isCreator && !challenge) return null;

    let chalEl;
    if (isEditor || isCreator)
        chalEl = <EditorWrap {...{ challenge, category, isCreator, embedded }} />;
    else
        chalEl = (
            <PluginComponent type={"challengeType"} name={challenge.challenge_type} fallback={"default"}
                challenge={challenge} category={category} embedded={embedded} />
        );

    return chalEl;
};
export default ChallengePage;
