export const setUser = (user) => {
    return {
        type: "SET_USER",
        payload: user
    };
};
export const editUser = (changes) => {
    return {
        type: "EDIT_USER",
        payload: changes
    };
};
export const clearUser = () => {
    return {
        type: "SET_USER",
        payload: null
    };
};
