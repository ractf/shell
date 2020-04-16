import React, { useState, useContext } from "react";
import Marker from "pigeon-marker";
import Map from "pigeon-maps";

import { FlashText, Button, FlexRow, appContext } from "ractf";

import "./ClickableMap.scss";


export default ({ challenge, submitFlag, onFlagResponse }) => {
    const minZoomLevel = challenge.challenge_metadata.minimum_zoom_level || 10;
    const [hasValidZoom, setHasValidZoom] = useState(false);
    const [selectedLongLat, setSelectedLongLat] = useState(null);
    const app = useContext(appContext);

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
            <Map className={"clickableMapMap"} center={[45.04, -4.04]}
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
    </div>;
};
