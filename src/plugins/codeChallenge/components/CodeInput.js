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

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

import colours from "@ractf/ui-kit/Colours.scss";

import "./Theme.scss";


const CodeInput = ({ val, width, height, lang, readOnly, onChange, ...rest }) => {
    const [value, setValue] = useState(val || "");

    return <div className={"ractf-code"}><Editor
        value={value}
        className={"ractf-code-editor"}
        onValueChange={v => {setValue(v); if (onChange) onChange(v);}}
        highlight={code =>
            highlight(code, languages.js)
              .split("\n")
              .map(
                line =>
                  `<span class="container_editor_line_number">${line}</span>`
              )
              .join("\n")
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
export default CodeInput;
