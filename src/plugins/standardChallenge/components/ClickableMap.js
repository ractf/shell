import React, { useState } from "react";
import Map from "pigeon-maps";

import "./ClickableMap.scss";
import { FlashText } from "../../../components/Misc";


export default ({ challenge, children }) => {
    const zoomInCloserMessage = "Zoom in closer to make a selection!";

    const minZoomLevel = challenge.challenge_metadata.minimum_zoom_level || 10;
    const [highlight, setHighlight] = useState(zoomInCloserMessage);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [hasValidZoom, setHasValidZoom] = useState(false);
    const [selectedLongLat, setSelectedLongLat] = useState(null);

    const click = (e) => {
        if (hasValidZoom) {
            setSelectedLongLat(e.latLng);
            setHighlight("Selected location: ");
            setSelectedLocation(`${e.latLng[0]}, ${e.latLng[1]}`);
        } else {
            setHighlight(zoomInCloserMessage);
        }
    };

    const onMapMove = (e) => {
        if (e["zoom"] > minZoomLevel) {
            if (!selectedLongLat) {
                setHighlight("Click on the map to select a location");
            };
            setHasValidZoom(true);
        } else {
            if (!selectedLongLat) {
                setHighlight(zoomInCloserMessage);
                setSelectedLocation("");
            };
            setHasValidZoom(false);
        }
    };

    return <div className={"clickableMapParent"}>
        <div className={"clickableMapBrief"}><div>{children}</div></div>
        <div className={"clickableMapMapParent"}>
            <FlashText>
                <div className={"selectedParent"}>
                    <div className="highlight">{highlight}</div>
                    <div className="selectedLocation">{selectedLocation}</div>
                </div>
            </FlashText>
            <Map className={"clickableMapMap"} center={[45.04, -4.04]} 
            defaultZoom={4} onClick={click} onBoundsChanged={onMapMove} nick="mybitch"/>
        </div>
    </div>;
};
