import { registerPlugin } from "ractf";

import ImportExport from "./components/ImportExport";


export default () => {
    registerPlugin("adminPage", "port", {
        component: ImportExport,
        sidebar: "Import/Export",
    });
};
