import React, { useState } from "react";
import { useSelector } from "react-redux";
import CodeInput from "./CodeInput";

import { codeRunAbort } from "../actions";
import { runCode } from "../api";
import { store } from "store";

import "./IDE.scss";


const Console = () => {
    const runState = useSelector(state => state.codeRun);
    let content;
    if (runState.error)
        content = "Error: " + runState.error;
    else if (runState.output)
        content = runState.output;
    else
        content = "";
    return <div className={"ide-console"}>{content}</div>;
};

export default ({ challenge, showLeft, setLeft }) => {
    const [console, setConsole] = useState(false);
    const [content, setContent] = useState(challenge.challenge_metadata.code_default || "");
    const runState = useSelector(state => state.codeRun);
    const lang = challenge.challenge_metadata.code_language || "python";

    const run = () => {
        runCode(lang, "main.py", content);
        setConsole(true);
    };
    const stop = () => {
        store.dispatch(codeRunAbort());
    };

    return <div className={"ide-editor" + (showLeft ? "" : " ie-row")}>
        <div className={"editor-top"}>
            <CodeInput val={content} onChange={setContent} lang={lang} />
            <div className={"editor-toolbar"}>
                {runState.running ?
                    <div className={"etb-button"} onClick={stop}>Stop</div>
                    : <div className={"etb-button run"} onClick={run}>Run</div>
                }
                <div className={"etb-button"} onClick={() => setLeft(left => !left)}>
                    {showLeft ? "Hide" : "Show"} Briefing
                </div>
                <div style={{ flexGrow: 1 }} />
                <div className={"etb-button"} onClick={() => setConsole(!console)}>
                    {console ? "Hide" : "Show"} Output
                </div>
                <div className={"etb-button warn"}>Reset</div>
            </div>
        </div>
        {console && <Console />}
    </div>;
};
