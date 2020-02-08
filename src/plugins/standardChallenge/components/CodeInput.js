import React, { useState } from "react";

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import colours from "../../../Colours.scss";

import "./Theme.scss";


export default ({ val, width, height, lang, readOnly, onChange, ...rest }) => {
    const [value, setValue] = useState(val || '');

    return <div className={"ractf-code"}><Editor
        value={value}
        className={"ractf-code-editor"}
        onValueChange={v => {setValue(v); if (onChange) onChange(v);}}
        highlight={code =>
            highlight(code, languages.js)
              .split('\n')
              .map(
                line =>
                  `<span class="container_editor_line_number">${line}</span>`
              )
              .join('\n')
          }
        tabSize={4}
        style={{
            fontFamily: colours.monoStack,
            fontSize: ".9em",
            color: colours.bg_l5,
            textShadow: "0 1px rgba(0, 0, 0, 0.3)",
            lineHeight: "1.5",
            minHeight: "100%",
            overflow: "visible"
        }}
    /></div>;
};
