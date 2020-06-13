const codeRunReducer = (state = { running: false }, { type, payload }) => {
    switch (type) {
        case "SET_CODE_RUN":
            return { ...state, ...payload };
        default:
            return state;
    }
};
export default codeRunReducer;
