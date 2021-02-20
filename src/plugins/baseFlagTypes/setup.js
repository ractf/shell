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

import { registerPlugin } from "@ractf/plugins";


export default () => {
    registerPlugin("flagType", "plaintext", {
        name: "Plaintext",
        schema: [
            {
                name: "flag",
                label: "Flag",
                type: "text"
            },
        ],
    });
    registerPlugin("flagType", "lenient", {
        name: "Lenient plaintext",
        schema: [
            {
                name: "flag",
                label: "Flag",
                type: "text"
            },
        ],
    });
    registerPlugin("flagType", "long_text", {
        name: "Long text",
        schema: [
            {
                name: "flag",
                label: "Flag",
                type: "multiline"
            },
        ],
    });
    registerPlugin("flagType", "hashed", {
        name: "SHA256 Hash",
        schema: [
            {
                name: "flag",
                label: "SHA256 hash of flag",
                regex: /[0-9a-fA-F]{64}/,
                type: "text"
            },
        ],
    });
    registerPlugin("flagType", "map", {
        name: "Map",
        schema: [
            {
                name: "location.0",
                label: "Latitude",
                type: "number"
            },
            {
                name: "location.1",
                label: "Longitude",
                type: "number"
            },
            {
                name: "radius",
                label: "Radius (km)",
                type: "number"
            },
        ],
    });
    registerPlugin("flagType", "regex", {
        name: "Regex",
        schema: [
            {
                name: "flag",
                label: "Regex",
                type: "text"
            },
        ],
    });
};
