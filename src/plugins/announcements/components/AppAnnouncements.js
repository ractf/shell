import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { store } from "store";

import { getAnnouncements } from "../api/announcements";
import * as actions from "../actions/announcements";
import Announcement from "./Announcement";


const AppAnnouncements = () => {
    const announcements = useSelector(store => store.announcements?.active) || [];

    useEffect(() => {
        getAnnouncements();
    }, []);

    const notifsEl = announcements.map((notif, n) => {
        const hide = () => {
            store.dispatch(actions.hideAnnouncement(notif));
        };
        return <Announcement {...notif} key={n} hide={hide} />;
    }).reverse();

    return <div className={"announcementsWrap"}>
        {notifsEl}
    </div>;
};
export default AppAnnouncements;
