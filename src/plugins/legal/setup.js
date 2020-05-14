import { registerPlugin } from "ractf";

import AboutPage from "./components/About";
import ConductPage from "./components/Conduct";
import PrivacyPage from "./components/Privacy";


export default () => {
    registerPlugin("page", "/conduct", {
        title: "Conduct",
        component: ConductPage,
    });
    registerPlugin("page", "/privacy", {
        title: "Privacy",
        component: PrivacyPage,
    });
};
