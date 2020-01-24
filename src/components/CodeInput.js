import React, { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night";


export default ({ val, lang }) => {
    const [value, setValue] = useState(val);

    return <AceEditor
        mode={lang}
        theme="tomorrow_night"
        style={{width: "100%"}}
        onChange={(val) => {setValue(val)}}
        showGutter
        value={value}
    />
};
