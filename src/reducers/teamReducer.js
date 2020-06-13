const teamReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "SET_TEAM":
            return payload;
        case "INIT_STATE":
            return payload.team;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
};
export default teamReducer;
