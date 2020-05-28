import { useState, useEffect } from "react";


export default () => {
    const getWinSize = () => ({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollscrollWidthHeight: window.scrollWidth,
        scrollHeight: window.scrollHeight,
    });

    const [winSize, setWinSize] = useState(getWinSize());
    const onResize = () => setWinSize(getWinSize());
    useEffect(onResize, []);
    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });

    return winSize;
};
