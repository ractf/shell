
import React, { useState , useCallback , useEffect , useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { colourToRGBA, makeClass, rgb2hex } from "@ractf/util";
import ColourPicker, { getForegroundColour, PalettePicker } from "@ractf/ui-kit/components/widgets/ColourPicker";
import { COLOURS, TYPES } from "@ractf/ui-kit/colours";
import { Row, Scrollbar } from "@ractf/ui-kit";

import { setColour, setColours, setType } from "actions/theme";

import style from "./Theme.module.scss";


const PALETTE = [
    "green", "teal", "cyan", "blue", "indigo", "purple", "pink", "red",
    "orange", "yellow", "black", "darkGrey", "grey", "lightGrey", "white"
];

const getBackLift = (background) => {
    const fg = getForegroundColour(background);
    const [r, g, b] = colourToRGBA(fg);
    return {
        "back-lift": `rgba(${r}, ${g}, ${b}, 0.125)`,
        "back-lift-2x": `rgba(${r}, ${g}, ${b}, 0.25)`,
    };
};

const Sample = React.forwardRef(({ colour, className, ...props }, ref) => (
    <div ref={ref}
        className={makeClass(style.sample, className)}
        style={{ backgroundColor: colour, color: getForegroundColour(colour) }}
        {...props}
    />
));
Sample.displayName = "Sample";

const resolveVar = (colour) => (
    (/^--[a-zA-Z-]+$/.test(colour)) ? `var(${colour})` : colour
);

const SamplePicker = ({ controls }) => {
    const current = COLOURS[controls];

    const [palette] = useState(() => {
        const localPalette = PALETTE.map(i => `--col-${i}`);
        if (current && localPalette.indexOf(current) === -1)
            localPalette.push(current);
        return localPalette;
    });

    const dispatch = useDispatch();
    const [active, setActive] = useState(current);
    const change = (i) => {
        if (controls === "background") {
            dispatch(setColours({
                [controls]: i,
                ...getBackLift(resolveVar(i))
            }));
        } else {
            dispatch(setColour(controls, i));
        }
        setActive(i);
    };

    return palette.map(i => (
        <Sample key={i}
            className={makeClass((i === active) && style.active)}
            onClick={() => change(i)} colour={resolveVar(i)}
        />
    ));
};

const SampleEditor = ({ controls }) => {
    const { t } = useTranslation();
    const [colour, setStateColour] = useState(() => (
        rgb2hex(...colourToRGBA(COLOURS[controls]))
    ));
    const [picker, setPicker] = useState(false);
    const wrapRef = useRef();
    const dispatch = useDispatch();

    const isBg = COLOURS.background === `var(--col-${controls})`;

    useEffect(() => {
        const close = (e) => {
            if (!wrapRef.current?.contains(e.target))
                setPicker(false);
        };
        document.addEventListener("mousedown", close);
        return () => {
            document.removeEventListener("mousedown", close);
        };
    }, []);

    const openPicker = useCallback(() => {
        setPicker(old => !old);
    }, []);
    const onChange = ([r, g, b, a]) => {
        const hex = rgb2hex(r, g, b, a);
        setStateColour(hex);
        if (isBg) {
            dispatch(setColours({
                [controls]: hex,
                ...getBackLift(hex)
            }));
        } else {
            dispatch(setColour(controls, hex));
        }
    };

    return (
        <Row vCentre>
            <Sample colour={colour} onClick={openPicker} ref={wrapRef}>
                {picker && <ColourPicker className={style.picker}
                    onChange={onChange} value={colour} />}
            </Sample>
            <div className={style.name}>{t(`colours.${controls}`)}</div>
        </Row>
    );
};

const TypeEditor = ({ controlsType, controlsDetail, name }) => {
    const [colour, setStateColour] = useState(resolveVar(TYPES[controlsType][controlsDetail]));
    const [picker, setPicker] = useState(false);
    const wrapRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const close = (e) => {
            if (!wrapRef.current?.contains(e.target))
                setPicker(false);
        };
        document.addEventListener("mousedown", close);
        return () => {
            document.removeEventListener("mousedown", close);
        };
    }, []);

    const openPicker = useCallback(() => {
        setPicker(old => !old);
    }, []);
    const onChange = (colour) => {
        // const hex = rgb2hex(r, g, b, a);
        setStateColour(colour);
        dispatch(setType(controlsType, { [controlsDetail]: colour }));
    };

    return (
        <Row vCentre>
            <Sample colour={resolveVar(colour)} onClick={openPicker} ref={wrapRef}>
                {picker && <PalettePicker className={style.picker}
                    onChange={onChange} value={colour} />}
            </Sample>
            <div className={style.name}>{name}</div>
        </Row>
    );
};

const ThemeEditor = () => {
    const [tab, setTab] = useState(0);
    const { t } = useTranslation();

    return (
        <div className={style.sidebar}>
            <Scrollbar>
                <div className={style.tabs}>
                    <div onClick={() => setTab(0)} className={makeClass(tab === 0 && style.active)}>
                        Colours
                    </div>
                    <div onClick={() => setTab(1)} className={makeClass(tab === 1 && style.active)}>
                        Palette
                    </div>
                    <div onClick={() => setTab(2)} className={makeClass(tab === 2 && style.active)}>
                        Advanced
                    </div>
                </div>
                <div className={style.tab} style={{ display: tab === 0 ? "block" : "none" }}>
                    <Row>
                        <div className={style.title}>{t("colours.textCol")}</div>
                    </Row>
                    <Row>
                        <SamplePicker controls={"color"} />
                    </Row>
                    <Row>
                        <div className={style.title}>{t("colours.backCol")}</div>
                    </Row>
                    <Row>
                        <SamplePicker controls={"background"} />
                    </Row>
                    <Row>
                        <div className={style.title}>{t("colours.accentCol")}</div>
                    </Row>
                    <Row>
                        <SamplePicker controls={"accent"} />
                    </Row>
                </div>
                <div className={style.tab} style={{ display: tab === 1 ? "block" : "none" }}>
                    {PALETTE.map(i => <SampleEditor key={i} controls={i} />)}
                </div>
                <div className={style.tab} style={{ display: tab === 2 ? "block" : "none" }}>
                    {Object.keys(TYPES).map(i => <>
                        <Row>
                            <code className={style.name}>{i}</code>
                        </Row>
                        <TypeEditor controlsType={i} controlsDetail={"fg"} name={t("colours.textCol")} />
                        <TypeEditor controlsType={i} controlsDetail={"bg"} name={t("colours.backCol")} />
                    </>)}
                </div>
            </Scrollbar>
        </div>
    );
};
export default React.memo(ThemeEditor);
