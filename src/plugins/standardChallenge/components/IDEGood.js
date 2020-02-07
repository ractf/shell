import React, { useState, useContext } from "react";

import CodeInput from "./CodeInput";

import { apiContext } from "ractf";

import "./IDEGood.scss"


const Console = () => {
    const api = useContext(apiContext);
    let content;
    if (api.codeRunState.error)
        content = "Error: " + api.codeRunState.error
    else if (api.codeRunState.output)
        content = api.codeRunState.output
    else
        content = ''
    return <div className={"ide-console"}>{content}</div>;
};

export default ({ challenge, children }) => {
    const [console, setConsole] = useState(false);
    const [brief, setBrief] = useState(true);
    const api = useContext(apiContext);
    const [content, setContent] = useState('');

    const run = () => {
        api.runCode("python", "main.py", content);
        setConsole(true);
    };
    const stop = () => {
        api.abortRunCode();
    };

    return <div className={"ide-split"}>
        {brief &&
            <div className={"ide-brief"}><div>{children}</div></div>
        }
        <div className={"ide-editor" + (brief ? "" : " ie-row")}>
            <div className={"editor-top"}>
                <CodeInput val={content} onChange={setContent} />
                <div className={"editor-toolbar"}>
                    {api.codeRunState.running ?
                        <div className={"etb-button"} onClick={stop}>Stop</div>
                        : <div className={"etb-button run"} onClick={run}>Run</div>
                    }
                    <div className={"etb-button"} onClick={() => setBrief(!brief)}>
                        {brief ? "Hide" : "Show"} Briefing
                    </div>
                    <div style={{ flexGrow: 1 }} />
                    <div className={"etb-button"} onClick={() => setConsole(!console)}>
                        {console ? "Hide" : "Show"} Output
                    </div>
                    <div className={"etb-button warn"}>Reset</div>
                </div>
            </div>
            {console && <Console />}
        </div>
    </div>;
};
