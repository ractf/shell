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
    challenge_metadata, author, challenge_type, unlocks, files, hidden, tags
}) => {
    return http.post(ENDPOINTS.CHALLENGES, {
        category: id, name, score, description,
        flag_type, flag_metadata,
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
    challenge_metadata, author, challenge_type, unlocks, files, hidden, tags
}) => {
    return http.patch(ENDPOINTS.CHALLENGES + id, {
        name, score, description,
        flag_type, flag_metadata,
        challenge_metadata, hidden,
        author, unlocks, files, tags,
        challenge_type: challenge_type || "default",
        auto_unlock,
    }).then(data => {
        store.dispatch(actions.editChallenge(data));
        return data;
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

export const linkChallenges = (chal1, chal2, linkState) => {
    if (linkState) {
        chal1.unlocks.push(chal2.id);
        chal2.unlocks.push(chal1.id);
    } else {
        chal1.unlocks = chal1.unlocks.filter(i => i !== chal2.id);
        chal2.unlocks = chal2.unlocks.filter(i => i !== chal1.id);
    }
    return Promise.all([
        http.patch(ENDPOINTS.CHALLENGES + chal1.id, { unlocks: chal1.unlocks }),
        http.patch(ENDPOINTS.CHALLENGES + chal2.id, { unlocks: chal2.unlocks })
    ]);
};

export const attemptFlag = (flag, challenge) => {
    return http.post(
        ENDPOINTS.SUBMIT_FLAG, { challenge: challenge.id, flag: flag }
    );
};
