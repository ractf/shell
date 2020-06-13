const tokenReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "SET_TOKEN":
            return payload;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
};
export default tokenReducer;
