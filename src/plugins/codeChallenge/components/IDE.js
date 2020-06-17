// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

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
