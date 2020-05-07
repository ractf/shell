import React from "react";
import { SizeMe } from 'react-sizeme';

import { Spinner } from "@ractf/ui-kit";
import colours from "@ractf/ui-kit/Colours.scss";

import usePlotlyReady from "./usePlotlyReady";
import "./Charts.scss";


const Pie = ({ data, width, height }) => {
    const plReady = usePlotlyReady();

    if (!plReady) return <div className={"graph-loading"}>
        <Spinner />
    </div>;

    const defaultConfig = {
        hole: .4,
        hovertemplate: '%{label}<br>%{value}<extra></extra>', 
        sort: false,
    };
    data = (data || []).map(i => ({...defaultConfig, ...i, type: "pie"}));

    const Plot = window.Plot;
    return <Plot
        style={{margin: "auto"}}
        data={data}
        layout={{
            width: (width || 300), height: (height || 300),
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


export default props => {
    if (props.width) return <Pie {...props} />;
    return <SizeMe className={"selfResizingSpacer"} noPlaceholder>{({ size }) => <>
        <div style={{ width: "100%" }} />
        <Pie {...props} width={size.width} />
    </>}</SizeMe>;
};
