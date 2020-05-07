import React from "react";
import { SizeMe } from 'react-sizeme';

import { Spinner } from "@ractf/ui-kit";
import colours from "@ractf/ui-kit/Colours.scss";

import usePlotlyReady from "./usePlotlyReady";
import "./Charts.scss";


const Graph = ({ data, width, height }) => {
    const plReady = usePlotlyReady();

    if (!plReady) return <div className={"graph-loading"}>
        <Spinner />
    </div>;

    data = (data || []).map(i => ({ mode: "lines+markers", ...i, type: "scatter" }));

    const Plot = window.Plot;
    return <Plot
        data={data}
        layout={{
            width: (width || 300), height: (height || 300),
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

export default props => {
    if (props.width) return <Graph {...props} />;
    return <SizeMe noPlaceholder>{({ size }) => <>
        <div className={"selfResizingSpacer"} style={{ width: "100%" }} />
        <Graph {...props} width={size.width} />
    </>}</SizeMe>;
};
