export const initState = ({ user, team, challenges }) => {
    return {
        type: "INIT_STATE",
        payload: { user, team, challenges }
    };
};
export const logout = () => {
    return {
        type: "LOGOUT",
        payload: null
    };
};
