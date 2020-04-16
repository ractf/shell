import React, { useState, useContext } from "react";
import Marker from "pigeon-marker";
import Map from "pigeon-maps";

import { FlashText, Button, FlexRow, appContext, Form, Input } from "ractf";

import "./ClickableMap.scss";


export const PROVIDER_URL = process.env.REACT_APP_MAP_PROVIDER;

export default ({ challenge, submitFlag, onFlagResponse }) => {
    const minZoomLevel = challenge.challenge_metadata.minimum_zoom_level || 10;
    const [hasValidZoom, setHasValidZoom] = useState(false);
    const [selectedLongLat, setSelectedLongLat] = useState(null);
    const [currentMapCenter, setCurrentMapCenter] = useState([45.04, -4.04]);
    const app = useContext(appContext);
    const invalidJmpMsg = "Please enter a valid input in the form longitude, latitude, for example " + 
                          "48.0, -32.8. Alternatively, enter a URL from Google Maps.";

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
        return fillTemplate(PROVIDER_URL, {x: x, y: y, z: z, dpr: dpr});
    };

    const click = (e) => {
        if (hasValidZoom) {
            setSelectedLongLat(e.latLng);
        } else {
            setSelectedLongLat(null);
        }
    };

    const onMapMove = (e) => {
        if (e["zoom"] > minZoomLevel) {
            setHasValidZoom(true);
        } else {
            setHasValidZoom(false);
        }
    };

    const round = (num) => {
        return Math.round(num * 1000000) / 1000000;
    };

    const jmpToLongLat = ({jmpTo}) => {
        if (!jmpTo) {
            return app.alert(invalidJmpMsg);
        }

        const regex = /[0-9]{1,2}\.[0-9]+/g;
        const longLat = jmpTo.match(regex);

        if (!longLat || (longLat.length < 2)) {
            return app.alert(invalidJmpMsg);
        }

        setCurrentMapCenter([longLat[0], longLat[1]]);
    };

    onFlagResponse.current = (success, message) => {
        setSelectedLongLat(null);
        if (!success)
            app.alert(message);
    };

    return <div className={"mapPartWrap"}>
        <FlashText warning={!hasValidZoom && !selectedLongLat}>
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
        <div className={"mapWrap"}>
            <Map className={"clickableMapMap"} center={currentMapCenter} provider={provider}
                defaultZoom={4} onClick={click} onBoundsChanged={onMapMove}>
                {selectedLongLat && <Marker paylod={1} anchor={selectedLongLat} />}
            </Map>

            {selectedLongLat && 
                <div className={"submitOverlay"}>
                    <div className={"soInner"}>
                        <div className={"soText"}>Location selected. Submit as flag?</div>
                        <FlexRow>
                            <Button click={() => setSelectedLongLat(null)} lesser>Cancel</Button>
                            <Button click={() => submitFlag({flag: selectedLongLat})}>Submit</Button>
                        </FlexRow>
                    </div>
                </div>
            }
        </div>
        <FlexRow style={{bottom: "0px"}}>
            <Form handle={jmpToLongLat}>
                <Input name={"jmpTo"} placeholder={"Jump to Long,Lat or enter G.Maps URL"}></Input>
                <Button submit>Jmp!</Button>
            </Form>
        </FlexRow>
    </div>;
};
