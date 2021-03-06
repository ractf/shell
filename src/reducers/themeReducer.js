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

const INITIAL = { colours: {}, types: {} };

const themeReducer = (state = INITIAL, { type, payload }) => {
    switch (type) {
        case "SET_THEME":
            return { ...state, ...payload };
        case "SET_THEME_COLOURS":
            return { ...state, colours: { ...state.colours, ...payload } };
        case "SET_THEME_TYPES":
            return { ...state, types: { ...state.types, ...payload } };
        case "SET_THEME_TYPE":
            return {
                ...state, types: {
                    ...state.types, [payload.type]: {
                        ...state.types[payload.type], ...payload.value
                    }
                }
            };
        default:
            return state;
    }
};
export default themeReducer;
