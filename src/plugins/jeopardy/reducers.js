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

const INITIAL = {
    filter: {}, search: "", showSolved: true, showLocked: false, openCards: {}
};

export const jeopardySearchReducer = (state = INITIAL, { type, payload }) => {
    switch (type) {
        case "SET_JEOPARDY_SEARCH":
            return { ...state, search: payload };
        case "SET_JEOPARDY_FILTER":
            return { ...state, filter: payload };
        case "SET_JEOPARDY_SHOW_SOLVED":
            return { ...state, showSolved: payload };
        case "SET_JEOPARDY_SORT":
            return { ...state, sort: payload };
        case "SET_JEOPARDY_SHOW_LOCKED":
            return { ...state, showLocked: payload };
        case "SET_JEOPARDY_OPEN_CARDS":
            return { ...state, openCards: payload };
        default:
            return state;
    }
};
