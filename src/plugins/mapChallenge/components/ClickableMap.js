import React, { useState, useContext } from "react";
import Marker from "pigeon-marker";
import Map from "pigeon-maps";

import { FlashText, Button, Row, Form, InputButton } from "@ractf/ui-kit";
import { appContext } from "ractf";

import "./ClickableMap.scss";


const PROVIDER_URL = process.env.REACT_APP_MAP_PROVIDER;
const LAT_LON_RE = /(-?\d+(?:\.\d+)?),\s*?(-?\d+(?:\.\d+)?)/;

export default ({ challenge, submitFlag, onFlagResponse }) => {
    const minZoomLevel = challenge.challenge_metadata.minimum_zoom_level || 10;
    const [hasValidZoom, setHasValidZoom] = useState(false);
    const [selectedLongLat, setSelectedLongLat] = useState(null);
    const [currentMapCenter, setCurrentMapCenter] = useState([45.04, -4.04]);
    const app = useContext(appContext);

    const INVALID_JUMP_MESSAGE = <>
        Please enter a valid input in the form <code>longitude,latitude</code>.
        For example, <code>48.0,-32.8</code>.
        <br />
        Alternatively, enter a URL from Google Maps.
    </>;

    const fillTemplate = (templateString, templateVars) => {
        Object.entries(templateVars).forEach(([key, val]) => {
            templateString = templateString.split("{{" + key + "}}").join(val);
        });
        return templateString;
    };

    const provider = (x, y, z, dpr) => {
        // Fallback to a free provider
        if (!PROVIDER_URL)
            return `https://stamen-tiles.a.ssl.fastly.net/toner/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`;
        return fillTemplate(PROVIDER_URL, { x: x, y: y, z: z, dpr: dpr });
    };

    const click = (e) => {
        if (hasValidZoom) {
            setSelectedLongLat(e.latLng);
        } else {
            setSelectedLongLat(null);
        }
    };

    const onMapMove = (e) => {
        setCurrentMapCenter(e.center);
        setHasValidZoom(e.zoom > minZoomLevel);
    };

    const round = (num) => {
        return Math.round(num * 1000000) / 1000000;
    };

    const jumpToLongLat = ({ jumpTo }) => {
        if (!jumpTo)
            return app.alert(INVALID_JUMP_MESSAGE);

        let latLon = LAT_LON_RE.exec(jumpTo);
        if (!latLon)
            return app.alert(INVALID_JUMP_MESSAGE);

        setCurrentMapCenter([parseFloat(latLon[1]), parseFloat(latLon[2])]);
    };

    onFlagResponse.current = (success, message) => {
        setSelectedLongLat(null);
        if (!success)
            app.alert(message);
    };

    return <>
        <Row>
            <FlashText danger={!hasValidZoom && !selectedLongLat}>
                {selectedLongLat ? <>
                    <div className="highlight">
                        Selected location: {round(selectedLongLat[0])}, {round(selectedLongLat[1])}
                    </div>
                </> : hasValidZoom ? <>
                    <div className="highlight">Click on the map to select a location</div>
                </> : <>
                            <div className="highlight">Zoom in closer to make a selection!</div>
                        </>}
            </FlashText>
        </Row>
        <Row className={"mapWrap"}>
            <Map className={"clickableMapMap"} center={currentMapCenter} provider={provider}
                defaultZoom={4} onClick={click} onBoundsChanged={onMapMove}>
                {selectedLongLat && <Marker paylod={1} anchor={selectedLongLat} />}
            </Map>

            {selectedLongLat &&
                <div className={"submitOverlay"}>
                    <div className={"soInner"}>
                        <div className={"soText"}>Location selected. Submit as flag?</div>
                        <Row>
                            <Button click={() => setSelectedLongLat(null)} lesser>Cancel</Button>
                            <Button click={() => submitFlag({ flag: selectedLongLat })}>Submit</Button>
                        </Row>
                    </div>
                </div>
            }
        </Row>
        <Row>
            <Form handle={jumpToLongLat}>
                <InputButton format={LAT_LON_RE} name={"jumpTo"} button={"Jump"}
                    placeholder={"Jump to Long,Lat or enter G.Maps URL"} submit />
            </Form>
        </Row>
    </>;
};
