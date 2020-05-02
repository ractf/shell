import { registerPlugin } from "ractf";

import WSTester from "./components/WSTester";
import Debug from "./components/Debug";


export default () => {
    registerPlugin("page", "/debug/ws", {
        title: "WebSocket Debugger",
        component: WSTester
    });
    registerPlugin("page", "/debug", {
        title: "Debug",
        component: Debug
    });
};
