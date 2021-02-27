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

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
    PageHead, Form, Row, Column, ThemeLoader, Button, ColourPicker,
    HR, PalettePicker
} from "@ractf/ui-kit";
import { BASE_COLOURS, COLOURS, BASE_TYPES, TYPES } from "@ractf/ui-kit/colours";
import { copyObj, rgb2hex, unmergeObj } from "@ractf/util";
import { downloadJSON } from "@ractf/util/download";

import { setTheme } from "actions/theme";

import UIPage from "./UI";
import style from "./Theme.module.scss";


const exportTheme = () => {
    const theme = {
        colours: unmergeObj(COLOURS, BASE_COLOURS),
        types: unmergeObj(TYPES, BASE_TYPES),
    };
    downloadJSON(theme, "theme");
};

const PaletteSample = ({ colour, stateRef, tlProps, palette = false }) => {
    const [open, setOpen] = useState(false);
    const [currColour, setColour] = useState(null);
    const toggle = useCallback((e) => {
        e.preventDefault();
        setOpen(old => !old);
    }, []);
    const wrapRef = useRef();

    useEffect(() => {
        const close = (e) => {
            if (!wrapRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("click", close);
        return () => {
            document.removeEventListener("click", close);
        };
    }, []);

    const onChange = useCallback((rgb) => {
        if (palette)
            setOpen(false);
        const hex = rgb2hex(...rgb);
        stateRef.current[colour] = hex;
        setColour(hex);
    }, [palette, stateRef, colour]);

    const Component = palette ? PalettePicker : ColourPicker;
    return <>
        {currColour && <ThemeLoader colours={{ [colour]: currColour }} minimal {...tlProps} />}

        <div onClick={toggle} className={style.sample} ref={wrapRef}
            style={{ backgroundColor: currColour || stateRef.current[colour] }}>
            {open && <Component value={stateRef.current[colour]} onChange={onChange} />}
        </div>
    </>;
};

const Editor = () => {
    const dispatch = useDispatch();
    const coloursRef = useRef(copyObj(COLOURS));
    const typesRef = useRef(copyObj(TYPES));

    const apply = useCallback(() => {
        requestAnimationFrame(() => {
            dispatch(setTheme({ colours: coloursRef.current, types: typesRef.current }));
        });
    }, [dispatch]);
    const reset = useCallback(() => {
        dispatch(setTheme({ colours: {}, types: {} }));
    }, [dispatch]);

    const tlProps = {
        root: ["#debug-root", "#debug-inner"],
    };

    return <>
        <ThemeLoader {...tlProps} />
        <Row>
            <Form.Group label={"Background"}>
                <PaletteSample stateRef={coloursRef} colour={"background"} tlProps={tlProps} />
            </Form.Group>
            <Form.Group label={"Foreground"}>
                <PaletteSample stateRef={coloursRef} colour={"color"} tlProps={tlProps} />
            </Form.Group>
            <Form.Group label={"Accent Colour"}>
                <PaletteSample stateRef={coloursRef} colour={"accent"} tlProps={tlProps} />
            </Form.Group>
        </Row>
        <Row>
            <Form.Group label={"Colour Scheme"}>
                <Row>
                    <PaletteSample stateRef={coloursRef} colour={"green"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"teal"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"cyan"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"blue"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"indigo"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"purple"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"pink"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"red"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"orange"} tlProps={tlProps} />
                    <PaletteSample stateRef={coloursRef} colour={"yellow"} tlProps={tlProps} />
                </Row>
            </Form.Group>
        </Row>
        <HR />
        <Row>
            <Button onClick={apply}>Apply</Button>
            <Button onClick={exportTheme}>Export</Button>
            <Button onClick={reset}>Reset</Button>
        </Row>
        {/* <div style={{ height: "80vh", overflow: "auto" }}>

            <Form valuesRef={valuesRef} onChange={onColourChange}>
                <Row>
                    {Object.keys(COLOURS).map(key => (
                        <Form.Group label={key} key={key}>
                            <Input name={key} value={COLOURS[key]} />
                        </Form.Group>
                    ))}
                </Row>
            </Form>
        </div> */}
    </>;
};

const Theme = () => {
    return <>
        <PageHead>Theme Editor</PageHead>
        <Row>
            <Column lgWidth={6}>
                <Editor />
            </Column>
            <Column lgWidth={6}>
                <div id="debug-root" style={{ height: "80vh", overflow: "auto" }}>
                    <div id="debug-inner" style={{
                        backgroundColor: "var(--col-background)",
                        color: "var(--col-color)",
                    }}>
                        <UIPage />
                    </div>
                </div>
            </Column>
        </Row>
    </>;
};
export default React.memo(Theme);
