import React, { useState, createRef, useEffect } from "react";

import Children from "./Children";
import Rule from "./Rule";


export default ({ title, children }) => {
    const [open, setOpen] = useState(true);
    const [height, setHeight] = useState('auto');
    const childRef = createRef();

    const onResize = () => {
        if (childRef.current && childRef.current.scrollHeight)
            setHeight(childRef.current.scrollHeight + "px");
    };
    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });

    useEffect(() => {
        onResize();
    });
    const click = e => {
        if (open)
            setHeight(childRef.current.scrollHeight + "px");
        setOpen(!open);
        e.preventDefault();
    };

    return <>
        <Rule open={open} onClick={click}>{title}</Rule>
        <Children openHeight={height} ref={childRef} open={open}>{children}</Children>
    </>;
};
