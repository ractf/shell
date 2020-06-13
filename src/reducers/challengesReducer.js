const challengesReducer = (state = { categories: [] }, { type, payload }) => {
    const categories = [...(state.categories || [])];

    switch (type) {
        case "SET_CHALLENGES":
            return { ...state, categories: payload };

        case "ADD_CATEGORY":
            return { ...state, categories: [...state.categories, payload] };
        case "EDIT_CATEGORY":
            return { ...state, categories: categories.map(i => {
                if (i.id !== payload.id) return i;
                return {...i, ...payload};
            })};
        case "REMOVE_CATEGORY":
            return { ...state, categories: state.categories.filter(i => i.id !== payload.id) };

        case "ADD_CHALLENGE":
            categories.forEach(i => {
                if (i.id === payload.categories) {
                    i.challenges.push(payload);
                }
            });
            return { ...state, categories };
        case "EDIT_CHALLENGE":
            categories.forEach(i => i.challenges.map(chal => {
                if (chal.id !== payload.id) return chal;
                return { ...chal, ...payload };
            }));
            return { ...state, categories };

        case "ADD_FILE":
            categories.forEach(i => i.challenges.forEach(j => {
                if (j.id === payload.chalId) {
                    j.files.push(payload.data);
                }
            }));
            return { ...state, categories };
        case "EDIT_FILE":
            categories.forEach(i => i.challenges.forEach(j => j.files.map(file => {
                if (file.id !== payload.fileId) return file;
                return { ...file, ...payload.data };
            })));
            return { ...state, categories };
        case "REMOVE_FILE":
            categories.forEach(i => i.challenges.forEach(chal => {
                chal.files = chal.files.filter(j => j.id.toString() !== payload.toString());
            }));
            return { ...state, categories };

        case "ADD_HINT":
            categories.forEach(i => i.challenges.forEach(chal => {
                if (chal.id === payload.chalId) {
                    chal.hints.push(payload.data);
                }
            }));
            return { ...state, categories };
        case "EDIT_HINT":
            categories.forEach(i => i.challenges.forEach(j => j.hints.map(hint => {
                if (hint.id !== payload.hintId) return hint;
                return { ...hint, ...payload.data };
            })));
            return { ...state, categories };
        case "REMOVE_HINT":
            categories.forEach(i => i.challenges.forEach(chal => {
                chal.hints = chal.hints.filter(j => j.id.toString() !== payload.toString());
            }));
            return { ...state, categories };

        case "INIT_STATE":
            return { ...state, categories: payload.challenges };
        case "LOGOUT":
            return { ...state, categories: [] };

        default:
            return state;
    }
};
export default challengesReducer;
