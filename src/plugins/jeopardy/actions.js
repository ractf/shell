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

export const setJeopardySearch = (search) => {
    return {
        type: "SET_JEOPARDY_SEARCH",
        payload: search
    };
};

export const setJeopardyFilter = (filter) => {
    return {
        type: "SET_JEOPARDY_FILTER",
        payload: filter
    };
};

export const setJeopardySort = (sort) => {
    return {
        type: "SET_JEOPARDY_SORT",
        payload: sort
    };
};

export const setJeopardyShowSolved = (showSolved) => {
    return {
        type: "SET_JEOPARDY_SHOW_SOLVED",
        payload: showSolved
    };
};

export const setJeopardyShowLocked = (showLocked) => {
    return {
        type: "SET_JEOPARDY_SHOW_LOCKED",
        payload: showLocked
    };
};

export const setJeopardyOpenCards = (openCards) => {
    return {
        type: "SET_JEOPARDY_OPEN_CARDS",
        payload: openCards
    };
};
