const INITIAL_STATE = {
    connected: false,
    cooldown: 1000,
    timer: 1,
};

const websocketReducer = (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case "SET_WEBSOCKET":
            return { ...state, ...payload };
        case "DECREMENT_WEBSOCKET_TIMER":
            return { ...state, timer: state.timer - 1 };
        default:
            return state;
    }
};
export default websocketReducer;
