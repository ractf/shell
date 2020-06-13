import { registerPlugin, registerReducer } from "ractf";
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
    registerPlugin("mountWithinApp", "announcements", {
        component: AppAnnouncements,
    });
    
    registerPlugin("wsMessage", WS_ANNOUNCEMENT, (data) => {
        store.dispatch(showAnnouncement(data));
    });
};
