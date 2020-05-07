import React, { useRef, useEffect, useState, useCallback } from "react";

import "./Scrollbar.scss";

export default ({ children, className, primary }) => {
    const inner = useRef();
    const track = useRef();

    const [dragStart, setDragStart] = useState(null);

    const [style, setStyle] = useState({ height: 0, top: 0 });
    const [trackStyle, setTrackStyle] = useState({ opacity: primary ? 1 : 0 });

    const rafRef = useRef();
    const lastScrollHeight = useRef();
    const fadeOut = useRef();
    const mouseOver = useRef();

    const barMetrics = () => {
        let scrollDist = inner.current.scrollHeight - inner.current.offsetHeight;
        let scrollRatio = inner.current.scrollTop / scrollDist;

        let barHeight = (inner.current.offsetHeight / inner.current.scrollHeight) * track.current.offsetHeight;
        let trackSlack = track.current.offsetHeight - barHeight;

        return [
            scrollDist === 0 ? 0 : trackSlack * scrollRatio,
            barHeight,
            scrollDist
        ];
    };

    const updateBar = useCallback(() => {
        if (!inner.current || !track.current) return;
        let [top, barHeight, scrollDist] = barMetrics();

        setStyle({ top: top, height: barHeight });
        setTrackStyle({ opacity: scrollDist === 0 ? 0 : 1 });
    }, [inner, track]);

    const onMouseDown = e => {
        setDragStart([e.pageY - track.current.offsetTop, barMetrics()[0]]);
        e.preventDefault();
    };
    const onMouseMove = useCallback(e => {
        if (!dragStart) return;
        let scroll = (e.pageY - track.current.offsetTop);
        let delta = scroll - dragStart[0];

        let scrollDist = inner.current.scrollHeight - inner.current.offsetHeight;
        let barHeight = (inner.current.offsetHeight / inner.current.scrollHeight) * track.current.offsetHeight;
        let trackSlack = track.current.offsetHeight - barHeight;

        let top = dragStart[1] + delta;

        inner.current.scrollTop = (top / trackSlack) * scrollDist;

        e.preventDefault();
    }, [dragStart, inner]);

    const onMouseOver = useCallback(() => {
        mouseOver.current = true;
        if (barMetrics()[2] === 0) return;
        setTrackStyle(trackStyle => ({ ...trackStyle, opacity: 1 }));
        if (fadeOut.current) clearTimeout(fadeOut.current);
    }, []);
    const onMouseLeave = useCallback((force) => {
        mouseOver.current = false;
        if (!force && dragStart) return;
        fadeOut.current = setTimeout(() => {
            setTrackStyle(trackStyle => ({ ...trackStyle, opacity: 0 }));
        }, 1500);
    }, [dragStart]);
    const onMouseUp = useCallback(() => {
        setDragStart(null);
        if (!mouseOver.current) onMouseLeave(true);
    }, [setDragStart, onMouseLeave]);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        let inner_current = inner.current;
        if (inner_current) {
            inner_current.addEventListener("mouseover", onMouseOver);
            inner_current.addEventListener("mouseleave", onMouseLeave);
        }
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            if (inner_current) {
                inner_current.removeEventListener("mouseover", onMouseOver);
                inner_current.removeEventListener("mouseleave", onMouseLeave);
            }
        };
    }, [inner, onMouseMove, onMouseUp, onMouseOver, onMouseLeave]);

    const animate = useCallback(() => {
        if (lastScrollHeight.current !== inner.current.scrollHeight)
            updateBar();
        lastScrollHeight.current = inner.current.scrollHeight;
        rafRef.current = requestAnimationFrame(animate);
    }, [updateBar]);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animate]);

    useEffect(updateBar, [inner]);

    return <div onScroll={updateBar} className={
        "scrolled" + (className ? (" " + className) : "") + (primary ? " primary" : "")
    }>
        <div ref={inner} className={"scrollInner"}>
            {children}
        </div>
        <div ref={track} style={trackStyle} className={"scrollTrack" + (dragStart ? " trackActive" : "")}>
            <div style={style} onMouseDown={onMouseDown} className={"scrollbar"} />
        </div>
    </div>;
};
