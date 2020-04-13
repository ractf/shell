import React from "react";

import { Spinner } from "ractf";
import colours from "../../Colours.scss";

import usePlotlyReady from "./usePlotlyReady";
import "./Charts.scss";


export default ({ data, width, height }) => {
    const plReady = usePlotlyReady();

    if (!plReady) return <div className={"graph-loading"}>
        <Spinner />
    </div>;

    width = width || 300;
    height = height || 300;

    const defaultConfig = {
        hole: .4,
        hovertemplate: '%{label}<br>%{value}<extra></extra>', 
        sort: false,
    };
    data = data.map(i => ({...defaultConfig, ...i, type: "pie"}));

    const Plot = window.Plot;
    return <Plot
        style={{margin: "auto"}}
        data={data}
        layout={{
            width: width, height: height,
            margin: { l: 0, r: 0, t: 0, b: 0, pad: 0 },
            hovermode: "closest",
            legend: { orientation: "h", font: { color: colours.bg_l4 } },
            plot_bgcolor: "transparent",
            plot_fgcolor: colours.fg,
            paper_bgcolor: "transparent",
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
