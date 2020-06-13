export const setConfig = (config) => {
    return {
        type: "SET_CONFIG",
        payload: config
    };
};
export const setConfigValue = (key, value) => {
    return {
        type: "SET_CONFIG",
        payload: { [key]: value }
    };
};
