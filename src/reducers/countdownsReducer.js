const countdownsReducer = (state = { dates: {}, passed: {} }, { type, payload }) => {
    switch (type) {
        case "SET_COUNTDOWNS":
            return { ...state, ...payload };
        default:
            return state;
    }
};
export default countdownsReducer;
