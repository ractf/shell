export const setWebsocket = (wsState) => {
    return {
        type: "SET_WEBSOCKET",
        payload: wsState
    };
};
export const decrementWSTimer = () => {
    return {
        type: "DECREMENT_WEBSOCKET_TIMER"
    };
};
