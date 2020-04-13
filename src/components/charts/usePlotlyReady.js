import { useState, useCallback } from "react";
import createPlotlyComponent from 'react-plotly.js/factory';


export default () => {
    const [plready, setPlready] = useState(window.__PLReady);
    const check = useCallback(() => {
        if (!plready && window.Plotly) {
            if (!window.__PLReady) {
                window.Plot = createPlotlyComponent(window.Plotly);
                window.__PLReady = true;
            }
            setPlready(true);
        } else setTimeout(check, 200);
    }, [plready]);
    if (!plready) setTimeout(check, 200);
    return plready;
};
