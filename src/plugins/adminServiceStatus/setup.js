import { registerPlugin } from "ractf";

import ServiceStatus from "./components/ServiceStatus";


export default () => {
    registerPlugin("adminPage", "service", {
        component: ServiceStatus,
        sidebar: "Service Status",
    });
};
