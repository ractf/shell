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

import { reloadAll } from "@ractf/api";
import * as http from "@ractf/util/http";

import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";


export const getChallenges = () => {
    return http.get(ENDPOINTS.CATEGORIES).then(data => {
        store.dispatch(actions.setChallenges(data));
    });
};

export const createChallenge = ({
    id, name, score, description, flag_type, flag_metadata,
    challenge_metadata, author, challenge_type, files, hidden, tags,
    post_score_explanation, unlock_requirements
}) => {
    return http.post(ENDPOINTS.CHALLENGES, {
        category: id, name, score, description,
        flag_type, flag_metadata, post_score_explanation,
        challenge_metadata, hidden, unlock_requirements,
        author, files, tags,
        challenge_type: challenge_type || "default",
    }).then(data => {
        store.dispatch(actions.addChallenge(data));
        return data;
    });
};

export const editChallenge = ({
    id, name, score, description, flag_type, flag_metadata,
    challenge_metadata, author, challenge_type, files, hidden, tags,
    post_score_explanation, unlock_requirements
}) => {
    const categories = store.getState().challenges?.categories || [];
    let original = null;
    categories.forEach(i => {
        original = i.challenges.filter(j => j.id === id)[0] || original;
    });
    const changes = {
        name, score, description, post_score_explanation,
        flag_type, flag_metadata, unlock_requirements,
        challenge_metadata, hidden,
        author, files, tags,
        challenge_type: challenge_type || "default",
    };
    // Immediate dispatch to make things feel more responsive
    store.dispatch(actions.editChallenge({ id, ...changes }));

    return http.patch(
        ENDPOINTS.CHALLENGES + id, changes
    ).then(data => {
        store.dispatch(actions.editChallenge(data));
        return data;
    }).catch(e => {
        // Rollback
        store.dispatch(actions.editChallenge(original));
        throw e;
    });
};

export const incrementSolveCount = (id, blood_name) => {
    store.dispatch(actions.incrementSolveCount(id, blood_name));
};

export const quickRemoveChallenge = async (challenge) => {
    return http.delete_(ENDPOINTS.CHALLENGES + challenge.id);
};
export const removeChallenge = async (challenge, dumbRemove) => {
    // TODO: This
    /*
    const categories = store.getState().challenges.categories;
    // Unlink all challenges
    await Promise.all(challenge.unlocks.map(i => (
        Promise.all(categories.map(cat =>
            Promise.all(cat.challenges.map(
                j => new Promise((res, rej) => {
                    if (j.id === i)
                        linkChallenges(challenge, j, false).then(res).catch(rej);
                    else res();
                })
            ))
        ))
    )));
    */
    quickRemoveChallenge(challenge).then(() => reloadAll());
};

export const linkChallenges = (challenge1, challenge2, linkState) => {
    // TODO: This
    return;
    /*
    let c1unlocks = [...challenge1.unlocks];
    let c2unlocks = [...challenge2.unlocks];

    if (linkState) {
        c1unlocks.push(challenge2.id);
        c2unlocks.push(challenge1.id);
    } else {
        c1unlocks = c1unlocks.filter(i => i !== challenge2.id);
        c2unlocks = c2unlocks.filter(i => i !== challenge1.id);
    }
    return Promise.all([
        challenge1.edit({ unlocks: c1unlocks }),
        challenge2.edit({ unlocks: c2unlocks }),
    ]);
    */
};

export const attemptFlag = (flag, challenge) => {
    return http.post(
        ENDPOINTS.SUBMIT_FLAG, { challenge: challenge.id, flag: flag }
    );
};
