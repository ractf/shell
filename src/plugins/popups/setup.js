// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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

import React from "react";

import { registerPlugin } from "@ractf/plugins";

import MedalPopup from "./components/MedalPopup";
import BasePopup from "./components/BasePopup";
import { ReactComponent as WinnerIcon } from "./winnerMedal.svg";


export default () => {
    registerPlugin("medal", "winner", {
        name: "Winner", description: "You won a thing, good boy", icon: <><WinnerIcon /></>
    });

    registerPlugin("popup", "medal", { component: MedalPopup });
    registerPlugin("popup", 0, { component: BasePopup });
};
