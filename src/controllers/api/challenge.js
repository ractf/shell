import { api, http } from "ractf";
import * as actions from "actions";
import { store } from "store";

import { ENDPOINTS } from "./consts";

export const getChallenges = () => {
    return http.get(ENDPOINTS.CATEGORIES).then(data => {
        store.dispatch(actions.setChallenges(data));
    });
};

export const createChallenge = ({
    id, name, score, description, flag_type, flag_metadata, autoUnlock,
    challenge_metadata, author, challenge_type, unlocks, files, hidden
}) => {
    return http.post(ENDPOINTS.CHALLENGES, {
        category: id, name, score, description,
        flag_type, flag_metadata,
        challenge_metadata, hidden,
        author, unlocks, files,
        challenge_type: challenge_type || "default",
        auto_unlock: autoUnlock,
    }).then(data => {
        store.dispatch(actions.addChallenge(data));
        return data;
    });
};

export const editChallenge = ({
    id, name, score, description, flag_type, flag_metadata, autoUnlock,
    challenge_metadata, author, challenge_type, unlocks, files, hidden
}) => {
    return http.patch(ENDPOINTS.CHALLENGES + id, {
        name, score, description,
        flag_type, flag_metadata,
        challenge_metadata, hidden,
        author, unlocks, files,
        challenge_type: challenge_type || "default",
        auto_unlock: autoUnlock,
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
    quickRemoveChallenge(challenge).then(() => api.reloadAll());
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
