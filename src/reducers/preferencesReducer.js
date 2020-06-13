const preferencesReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "SET_PREFERENCES":
            return { ...state, ...payload };
        default:
            return state;
    }
};
export default preferencesReducer;
