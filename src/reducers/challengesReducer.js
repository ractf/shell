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

const challengesReducer = (state = { categories: [] }, { type, payload }) => {
    const categories = [...(state.categories || [])];

    switch (type) {
        case "SET_CHALLENGES":
            return { ...state, categories: payload };

        case "ADD_CATEGORY":
            return { ...state, categories: [...state.categories, { challenges: [], ...payload }] };
        case "EDIT_CATEGORY":
            return {
                ...state, categories: categories.map(i => {
                    if (i.id !== payload.id) return i;
                    return { ...i, ...payload };
                })
            };
        case "REMOVE_CATEGORY":
            return { ...state, categories: state.categories.filter(i => i.id !== payload.id) };

        case "ADD_CHALLENGE":
            categories.forEach(i => {
                if (i.id === payload.category) {
                    i.challenges.push(payload);
                }
            });
            return { ...state, categories };
        case "EDIT_CHALLENGE":
            categories.forEach(i => i.challenges.map(chal => {
                if (chal.id !== payload.id) return chal;
                return { ...chal, ...payload };
            }));
            return { ...state, categories };

        case "ADD_FILE":
            categories.forEach(i => i.challenges.forEach(j => {
                if (j.id === payload.chalId) {
                    j.files.push(payload.data);
                }
            }));
            return { ...state, categories };
        case "EDIT_FILE":
            categories.forEach(i => i.challenges.forEach(j => j.files.map(file => {
                if (file.id !== payload.fileId) return file;
                return { ...file, ...payload.data };
            })));
            return { ...state, categories };
        case "REMOVE_FILE":
            categories.forEach(i => i.challenges.forEach(chal => {
                chal.files = chal.files.filter(j => j.id.toString() !== payload.toString());
            }));
            return { ...state, categories };

        case "ADD_HINT":
            categories.forEach(i => i.challenges.forEach(chal => {
                if (chal.id === payload.chalId) {
                    chal.hints.push(payload.data);
                }
            }));
            return { ...state, categories };
        case "EDIT_HINT":
            categories.forEach(i => i.challenges.forEach(chal => {
                chal.hints = chal.hints.map(hint => {
                    if (hint.id !== payload.hintId) return hint;
                    return { ...hint, ...payload.data };
                });
            }));
            return { ...state, categories };
        case "REMOVE_HINT":
            categories.forEach(i => i.challenges.forEach(chal => {
                chal.hints = chal.hints.filter(j => j.id.toString() !== payload.toString());
            }));
            return { ...state, categories };

        case "INIT_STATE":
            return { ...state, categories: payload.challenges };
        case "LOGOUT":
            return { ...state, categories: [] };

        default:
            return state;
    }
};
export default challengesReducer;
