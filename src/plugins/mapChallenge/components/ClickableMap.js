// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useState, useContext } from "react";
import Marker from "pigeon-marker";
import Map from "pigeon-maps";

import { Card, Form, InputButton, Modal } from "@ractf/ui-kit";
import { appContext } from "@ractf/shell-util";

import "./ClickableMap.scss";


const PROVIDER_URL = process.env.REACT_APP_MAP_PROVIDER;
const LAT_LON_RE = /(-?\d+(?:\.\d+)?),\s*?(-?\d+(?:\.\d+)?)/;

const round = (num) => {
    return Math.round(num * 1000000) / 1000000;
};

const fillTemplate = (templateString, templateVars) => {
    Object.entries(templateVars).forEach(([key, val]) => {
        templateString = templateString.split("{{" + key + "}}").join(val);
    });
    return templateString;
};

const provider = (x, y, z, dpr) => {
    // Fallback to a free provider
    if (!PROVIDER_URL)
        return `https://stamen-tiles.a.ssl.fastly.net/toner/${z}/${x}/${y}${dpr >= 2 ? "@2x" : ""}.png`;
    return fillTemplate(PROVIDER_URL, { x: x, y: y, z: z, dpr: dpr });
};

const toDMS = (decimal) => {
    const degrees = Math.floor(decimal);
    const minutes = Math.floor(60 * (decimal - degrees));
    const seconds = Math.floor(3600 * (decimal - degrees) - 60 * minutes);
    return `${degrees}°${minutes}'${seconds}"`;
};

const toDMSPair = (lat, lon) => {
    lat = toDMS(lat);
    if (lat.charAt(0) === "-")
        lat = lat.slice(1) + " S";
    else lat += " N";

    lon = toDMS(lon);
    if (lon.charAt(0) === "-")
        lon = lon.slice(1) + " W";
    else lon += " E";
    return `${lat} ${lon}`;
};

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

    const jumpToLongLat = ({ jumpTo }) => {
        if (!jumpTo)
            return app.alert(INVALID_JUMP_MESSAGE);

        const latLon = LAT_LON_RE.exec(jumpTo);
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
        <Card slim danger={!hasValidZoom && !selectedLongLat}>
            {selectedLongLat ? <>
                <div className="highlight">
                    Selected location: {round(selectedLongLat[0])}, {round(selectedLongLat[1])}
                </div>
            </> : hasValidZoom ? <>
                <div className="highlight">Click on the map to select a location</div>
            </> : <>
                        <div className="highlight">Zoom in closer to make a selection!</div>
                    </>}
        </Card>
        <div className={"mapWrap"}>
            <Map className={"clickableMapMap"} center={currentMapCenter} provider={provider}
                defaultZoom={4} onClick={click} onBoundsChanged={onMapMove}>
                {selectedLongLat && <Marker payload={1} anchor={selectedLongLat} />}
            </Map>

            {selectedLongLat && (
                <Modal small okay={"Submit"}
                    onClose={() => setSelectedLongLat(null)}
                    onConfirm={() => submitFlag.current({ flag: selectedLongLat })}
                >
                    {toDMSPair(...selectedLongLat)} selected. Submit as flag?
                </Modal>
            )}
        </div>
        <Form handle={jumpToLongLat}>
            <InputButton format={LAT_LON_RE} name={"jumpTo"} button={"Jump"}
                placeholder={"Jump to Long,Lat or enter G.Maps URL"} submit />
        </Form>
    </>;
};
