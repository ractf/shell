const configReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "SET_CONFIG":
            return { ...state, ...payload };
        default:
            return state;
    }
};
export default configReducer;
