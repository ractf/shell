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

export const ENDPOINTS = {
    COUNTDOWN: "/stats/countdown/",
    CONFIG: "/config/",
    ANNOUNCEMENTS: "/announcements/",

    REGISTER: "/auth/register/",
    LOGIN: "/auth/login/",
    LOGIN_2FA: "/auth/login_2fa/",
    ADD_2FA: "/auth/add_2fa/",
    VERIFY_2FA: "/auth/verify_2fa/",
    REMOVE_2FA: "/auth/remove_2fa/",
    VERIFY: "/auth/verify_email/",
    RESEND_VERIFICATION: "/auth/resend_email/",
    REQUEST_RESET: "/auth/request_password_reset/",
    COMPLETE_RESET: "/auth/password_reset/",
    CHANGE_PASSWORD: "/auth/change_password/",

    CATEGORIES: "/challenges/categories/",
    CHALLENGES: "/challenges/",
    SUBMIT_FLAG: "/challenges/submit_flag/",

    FILE: "/challenges/files/",
    HINT: "/hints/",
    USE_HINT: "/hints/use/",

    USER: "/member/",
    TEAM: "/team/",

    TEAM_CREATE: "/team/create/",
    TEAM_JOIN: "/team/join/",
    TEAM_LEAVE: "/team/leave/",

    LEADERBOARD_GRAPH: "/leaderboard/graph/",
    LEADERBOARD_USER: "/leaderboard/user/",
    LEADERBOARD_TEAM: "/leaderboard/team/",

    STATS: "/stats/stats/",
    VERSION: "/stats/version/",
};
