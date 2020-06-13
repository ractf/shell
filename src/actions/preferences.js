export const setPreferences = (preferences) => {
    return {
        type: "SET_PREFERENCES",
        payload: preferences
    };
};
export const setPreference = (key, value) => {
    return {
        type: "SET_PREFERENCES",
        payload: { [key]: value }
    };
};
