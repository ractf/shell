import React, { useState, useEffect } from "react";

import { Spinner } from "ractf";
import colours from "../../Colours.scss";

import usePlotlyReady from "./usePlotlyReady";
import "./Charts.scss";


export default ({ data }) => {
    const plReady = usePlotlyReady();
    const [rr, setRr] = useState(0);

    const onResize = (e) => {
        setRr(rr + 1);
    };
    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });
    if (!plReady) return <div className={"graph-loading"}>
        <Spinner />
    </div>;

    let width;
    if (window.innerWidth <= 800)
        width = window.innerWidth - 90;
    else if (window.innerWidth <= 1200)
        width = window.innerWidth - 400;
    else
        width = window.innerWidth - 527;
    width = Math.min(1001, width);

    const Plot = window.Plot;
    return <Plot
        data={data}
        layout={{
            width: width, height: 300,
            margin: { l: 50, r: 50, t: 50, pad: 0 },
            hovermode: "closest",
            legend: { orientation: "h", font: { color: colours.bg_l4 } },
            plot_bgcolor: colours.bg_d0,
            plot_fgcolor: colours.fg,
            paper_bgcolor: colours.bg_d0,
            xaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: { color: colours.bg_l4 },
                showspikes: true
            },
            yaxis: {
                gridcolor: colours.bg_l2,
                linecolor: colours.bg_l3,
                tickfont: { color: colours.bg_l4 },
                showspikes: true
            },
        }}
    />;
};
