import React, { useState } from "react";
import Marker from "pigeon-marker";
import Map from "pigeon-maps";

import "./ClickableMap.scss";
import { FlashText } from "../../../components/Misc";


export default ({ challenge, children }) => {
    const minZoomLevel = challenge.challenge_metadata.minimum_zoom_level || 10;
    const [hasValidZoom, setHasValidZoom] = useState(false);
    const [selectedLongLat, setSelectedLongLat] = useState(null);

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
    }

    return <div className={"mapPartWrap"}>
        <FlashText>
            <div className={"selectedParent"}>
                {selectedLongLat ? <>
                    <div className="highlight">
                        Selected location: {round(selectedLongLat[0])}, {round(selectedLongLat[1])}
                    </div>
                </> : hasValidZoom ? <>
                    <div className="highlight">Click on the map to select a location</div>
                </> : <>
                    <div className="highlight">Zoom in closer to make a selection!</div>
                </>}
                
            </div>
        </FlashText>
        <div className={"mapWrap"}>
            <Map className={"clickableMapMap"} center={[45.04, -4.04]}
                defaultZoom={4} onClick={click} onBoundsChanged={onMapMove}>
                {selectedLongLat && <Marker paylod={1} anchor={selectedLongLat} />}
            </Map>
        </div>
    </div>;
};
