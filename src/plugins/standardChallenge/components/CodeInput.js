import React from "react";
import MonacoEditor from 'react-monaco-editor';

import colours from "../../../Colours.scss";


export default ({ val, width, height, lang, readOnly, onChange, ...rest }) => {
    const value = val;
    const setValue = () => {};

    const editorWillMount = ({ editor }) => {
        editor.defineTheme("ractf", {
            base: "vs-dark",
            inherit: true,
            rules: [{ background: colours.bg }],
            colors: {
                'editor.foreground': colours.fg,
                'editor.background': colours.bg,
                'editorCursor.foreground': colours.fg,
                'editor.lineHighlightBackground': colours.bg_d0,
                'editorLineNumber.foreground': colours.bg_l5,
                'editor.selectionBackground': colours.bg_l1,
                'editor.inactiveSelectionBackground': colours.bg_l2
            }
          });
    };

    const options = {
        readOnly: readOnly,
        automaticLayout: true,
    };
    return (
        <MonacoEditor
            width={width || "100%"}
            height={height || "100%"}
            language={lang}
            theme="ractf"
            value={value}
            options={options}
            editorWillMount={editorWillMount}
            onChange={onChange || (val => setValue(val))}
        />
    );
};
