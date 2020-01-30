import React, { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

import ace from "ace-builds/src-noconflict/ace";

ace.config.set("basePath", "/");
ace.config.setModuleUrl('ace/mode/javascript_worker', "/ace/worker-javascript.min.js");

export default ({ val, height, lang, readOnly, onChange, ...rest }) => {
    const [value, setValue] = useState(val);

    return <AceEditor
        mode={lang}
        theme="terminal"
        style={{width: "100%", height: height || "500px"}}
        onChange={onChange || (val => setValue(val))}
        readOnly={readOnly}
        showGutter wrapEnabled
        enableBasicAutocompletion
        enableLiveAutocompletion
        value={onChange ? val : value}
        {...rest}
    />
};
