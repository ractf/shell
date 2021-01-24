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

import { reloadAll } from "@ractf/api";
import { ENDPOINTS } from "./consts";
import * as actions from "actions";
import { store } from "store";
import http from "@ractf/http";

export const getChallenges = () => {
    return http.get(ENDPOINTS.CATEGORIES).then(data => {
        store.dispatch(actions.setChallenges(data));
    });
};

export const createChallenge = ({
    id, name, score, description, flag_type, flag_metadata, auto_unlock,
    challenge_metadata, author, challenge_type, unlocks, files, hidden, tags,
    post_score_explanation
}) => {
    return http.post(ENDPOINTS.CHALLENGES, {
        category: id, name, score, description,
        flag_type, flag_metadata, post_score_explanation,
        challenge_metadata, hidden,
        author, unlocks, files, tags,
        challenge_type: challenge_type || "default",
        auto_unlock,
    }).then(data => {
        store.dispatch(actions.addChallenge(data));
        return data;
    });
};

export const editChallenge = ({
    id, name, score, description, flag_type, flag_metadata, auto_unlock,
    challenge_metadata, author, challenge_type, unlocks, files, hidden, tags,
    post_score_explanation
}) => {
    const categories = store.getState().challenges?.categories || [];
    let original = null;
    categories.forEach(i => {
        original = i.challenges.filter(j => j.id === id)[0] || original;
    });
    const changes = {
        name, score, description, post_score_explanation,
        flag_type, flag_metadata,
        challenge_metadata, hidden,
        author, unlocks, files, tags,
        challenge_type: challenge_type || "default",
        auto_unlock,
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

export const quickRemoveChallenge = async (challenge) => {
    return http.delete(ENDPOINTS.CHALLENGES + challenge.id);
};
export const removeChallenge = async (challenge, dumbRemove) => {
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
    quickRemoveChallenge(challenge).then(() => reloadAll());
};

export const linkChallenges = (challenge1, challenge2, linkState) => {
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
};

export const attemptFlag = (flag, challenge) => {
    return http.post(
        ENDPOINTS.SUBMIT_FLAG, { challenge: challenge.id, flag: flag }
    );
};
