export const setTeam = (team) => {
    return {
        type: "SET_TEAM",
        payload: team
    };
};
export const clearTeam = () => {
    return {
        type: "SET_TEAM",
        payload: null
    };
};
