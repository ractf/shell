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
