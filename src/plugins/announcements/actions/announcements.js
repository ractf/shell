export const showAnnouncement = (announcement) => {
    return {
        type: "SHOW_ANNOUNCEMENT",
        payload: announcement
    };
};
export const hideAnnouncement = (announcement) => {
    return {
        type: "HIDE_ANNOUNCEMENT",
        payload: announcement
    };
};
