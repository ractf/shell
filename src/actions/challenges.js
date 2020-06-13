export const setChallenges = (challenges) => {
    return {
        type: "SET_CHALLENGES",
        payload: challenges
    };
};

export const addCategory = (category) => {
    return {
        type: "ADD_CATEGORY",
        payload: category
    };
};
export const editCategory = (category) => {
    return {
        type: "EDIT_CATEGORY",
        payload: category
    };
};
export const removeCategory = (category) => {
    return {
        type: "REMOVE_CATEGORY",
        payload: category
    };
};

export const addChallenge = (challenge) => {
    return {
        type: "ADD_CHALLENGE",
        payload: challenge
    };
};
export const editChallenge = (challenge) => {
    return {
        type: "EDIT_CHALLENGE",
        payload: challenge
    };
};

export const addFile = (chalId, data) => {
    return {
        type: "ADD_FILE",
        payload: { chalId, data }
    };
};
export const editFile = (fileId, data) => {
    return {
        type: "EDIT_FILE",
        payload: { fileId, data }
    };
};
export const removeFile = (fileId) => {
    return {
        type: "REMOVE_FILE",
        payload: fileId
    };
};

export const addHint = (chalId, data) => {
    return {
        type: "ADD_HINT",
        payload: { chalId, data }
    };
};
export const editHint = (hintId, data) => {
    return {
        type: "EDIT_HINT",
        payload: { hintId, data }
    };
};
export const removeHint = (hintId) => {
    return {
        type: "REMOVE_HINT",
        payload: hintId
    };
};
