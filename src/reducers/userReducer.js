const userReducer = (state = null, { type, payload }) => {
    switch (type) {
        case "SET_USER":
            return payload;
        case "EDIT_USER":
            return { ...state, ...payload };
        case "INIT_STATE":
            return payload.user;
        case "LOGOUT":
            return null;
        default:
            return state;
    }
};
export default userReducer;
