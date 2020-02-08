import React from "react";

import { registerPlugin } from "ractf";

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
