import { registerPlugin, dynamicLoad } from "ractf";

export default () => {
    const wsTester = dynamicLoad(() => import("./components/WSTester"));
    const debug = dynamicLoad(() => import("./components/Debug"));

    registerPlugin("page", "/debug/ws", {
        title: "WebSocket Debugger",
        component: wsTester
    });
    registerPlugin("page", "/debug", {
        title: "Debug",
        component: debug
    });
};
