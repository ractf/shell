import { codeRunError, codeRunStart } from "../actions";
import { store } from "store";

import { http } from "ractf";

const RUN_CODE_ENDPOINT = "/";

export const runCode = (runType, fileName, fileContent) => {
    const codeRunState = store.getState().codeRun;
    if (codeRunState.running) return;

    http.post(RUN_CODE_ENDPOINT + runType, { exec: btoa(fileContent) }).then(resp => {
        //
    }).catch(e => {
        store.dispatch(codeRunError(http.getError(e)));
    });
    store.dispatch(codeRunStart(fileName));
};
