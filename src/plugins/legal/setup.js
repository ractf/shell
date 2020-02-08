import { registerPlugin } from "ractf";

import AboutPage from "./components/About";
import ConductPage from "./components/Conduct";
import PrivacyPage from "./components/Privacy";


export default () => {
    registerPlugin("page", "/about", AboutPage);
    registerPlugin("page", "/conduct", ConductPage);
    registerPlugin("page", "/privacy", PrivacyPage);
};
