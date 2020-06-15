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

const announcementsReducer = (state = { active: [], hidden: [] }, { type, payload }) => {
    switch (type) {
        case "SHOW_ANNOUNCEMENT":
            if (state.hidden.indexOf(payload.id) !== -1) return state;
            for (let i = 0; i < state.active.length; i++)
                if (state.active[i].id === payload.id)
                    return state;
            return { ...state, active: [...state.active, payload] };
        case "HIDE_ANNOUNCEMENT":
            return {
                ...state,
                active: state.active.filter(i => i.id !== payload.id),
                hidden: state.hidden.indexOf(payload.id) !== -1
                    ? state.hidden : [...state.hidden, payload.id]
            };
        default:
            return state;
    }
};
export default announcementsReducer;
