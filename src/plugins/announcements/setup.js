import { registerPlugin, registerReducer, registerMount } from "ractf";
import { store } from "store";

import announcementsReducer from "./reducers/announcementsReducer";
import { showAnnouncement } from "./actions/announcements";
import AdminAnnouncements from "./components/AdminAnnouncements";
import AppAnnouncements from "./components/AppAnnouncements";


const WS_ANNOUNCEMENT = 5;

export default () => {
    registerReducer("announcements", announcementsReducer);

    registerPlugin("adminPage", "announcements", {
        component: AdminAnnouncements,
        sidebar: "Announcements",
    });
    registerMount("app", "announcements", AppAnnouncements);
    
    registerPlugin("wsMessage", WS_ANNOUNCEMENT, (data) => {
        store.dispatch(showAnnouncement(data));
    });
};
