// Copyright (C) 2020 Really Awesome Technology Ltd
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

import { registerPlugin, dynamicLoad } from "ractf";
import LoadingPage from "../../pages/LoadingPage";

export default () => {
    const wsTester = dynamicLoad(() => import(/* webpackChunkName: "ws-tester" */ "./components/WSTester"));
    const debug = dynamicLoad(() => import(/* webpackChunkName: "debug" */ "./components/Debug"));

    registerPlugin("page", "/debug/ws", {
        title: "WebSocket Debugger",
        component: wsTester
    });
    registerPlugin("page", "/debug/loading", {
        title: "LoadingPage",
        component: LoadingPage
    });
    registerPlugin("page", "/debug", {
        title: "Debug",
        component: debug
    });
};
