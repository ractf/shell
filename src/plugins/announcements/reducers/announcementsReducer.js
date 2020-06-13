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
