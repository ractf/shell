import React, { useState, useContext } from "react";

import CodeInput from "./CodeInput";

import { apiContext, apiEndpoints } from "ractf";

import "./IDE.scss";


const Console = () => {
    const api = useContext(apiContext);
    let content;
    if (api.codeRunState.error)
        content = "Error: " + api.codeRunState.error;
    else if (api.codeRunState.output)
        content = api.codeRunState.output;
    else
        content = '';
    return <div className={"ide-console"}>{content}</div>;
};

export default ({ challenge, children, showLeft, setLeft }) => {
    const [console, setConsole] = useState(false);
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const [content, setContent] = useState(challenge.challenge_metadata.code_default || "");
    const lang = challenge.challenge_metadata.code_language || "python";

    const run = () => {
        endpoints.runCode(lang, "main.py", content);
        setConsole(true);
    };
    const stop = () => {
        endpoints.abortRunCode();
    };

    return <div className={"ide-editor" + (showLeft ? "" : " ie-row")}>
        <div className={"editor-top"}>
            <CodeInput val={content} onChange={setContent} lang={lang} />
            <div className={"editor-toolbar"}>
                {api.codeRunState.running ?
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
