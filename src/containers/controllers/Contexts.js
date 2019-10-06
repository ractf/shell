import React from "react";


export const AppContext = React.createContext({
    promptConfirm: null,
});


export const APIContext = React.createContext({
    ready: false,
    authenticated: false,
    user: {
        username: null,
        id: null,
        referal: null,
    },
    challenges: [],
    categories: [],
});
