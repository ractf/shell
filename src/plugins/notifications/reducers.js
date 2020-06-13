export const notificationReducer = (state = [], { type, payload }) => {
    switch (type) {
        case "SHOW_NOTIFICATION":
            for (let i = 0; i < state.length; i++)
                if (state[i].id === payload.id)
                    return state;
            return [...state, payload];
        case "HIDE_NOTIFICATION":
            return state.filter(i => i.id !== payload.id);    
        default:
            return state;
    }
};
