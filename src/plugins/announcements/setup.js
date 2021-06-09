// Copyright (C) 2020-2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import { FiMessageCircle } from "react-icons/fi";

import { registerPlugin, registerReducer, registerMount } from "@ractf/plugins";

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
        Icon: FiMessageCircle,
    });
    registerMount("app", "announcements", AppAnnouncements);

    registerPlugin("wsMessage", WS_ANNOUNCEMENT, (data) => {
        store.dispatch(showAnnouncement(data));
    });
};
