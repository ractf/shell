export const DOMAIN = process.env.REACT_APP_API_DOMAIN;
export const API_BASE = process.env.REACT_APP_API_BASE;
export const BASE_URL = DOMAIN + API_BASE;
export const ENDPOINTS = {
    COUNTDOWN: "/stats/countdown/",
    CONFIG: "/config/",
    ANNOUNCEMENTS: "/announcements/",

    REGISTER: "/auth/register/",
    LOGIN: "/auth/login/",
    ADD_2FA: "/auth/add_2fa/",
    VERIFY_2FA: "/auth/verify_2fa/",
    VERIFY: "/auth/verify_email/",
    REQUEST_RESET: "/auth/request_password_reset/",
    COMPLETE_RESET: "/auth/password_reset/",

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

    LEADERBOARD_GRAPH: "/leaderboard/graph/",
    LEADERBOARD_USER: "/leaderboard/user/",
    LEADERBOARD_TEAM: "/leaderboard/team/",

    STATS: "/stats/stats/",
    VERSION: "/stats/version/",
};
