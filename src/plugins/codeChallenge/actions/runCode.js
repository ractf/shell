export const codeRunStart = (name) => {
    return {
        type: "SET_CODE_RUN",
        payload: { name: name, running: true, start: new Date() }
    };
};
export const codeRunError = (error) => {
    return {
        type: "SET_CODE_RUN",
        payload: { error: error, running: false }
    };
};
export const codeRunAbort = (error) => {
    return {
        type: "SET_CODE_RUN",
        payload: { running: false }
    };
};
