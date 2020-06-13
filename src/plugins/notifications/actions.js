export const hideNotification = (notification) => {
    return {
        type: "HIDE_NOTIFICATION",
        payload: notification
    };
};
export const showNotification = (notification) => {
    return {
        type: "SHOW_NOTIFICATION",
        payload: notification
    };
};
