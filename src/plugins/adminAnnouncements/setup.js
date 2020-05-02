import { registerPlugin } from "ractf";

import AdminAnnouncements from "./components/AdminAnnouncements";


export default () => {
    registerPlugin("adminPage", "announcements", {
        component: AdminAnnouncements,
        sidebar: "Announcements",
    });
};
