import { useState, useEffect } from "react";


export default () => {
    const [winSize, setWinSize] = useState({});

    const onResize = () => {
        setWinSize({
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            scrollscrollWidthHeight: window.scrollWidth,
            scrollHeight: window.scrollHeight,
        });
    };
    useEffect(onResize, []);

    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });

    return winSize;
};
