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

import { registerPlugin } from "ractf";

import AdminConfig from "./components/AdminConfig";


export default () => {
    registerPlugin("adminPage", "config", {
        component: AdminConfig,
        sidebar: "Configuration",
    });

    registerPlugin("config", "baseConfig", [
        ["", "Dates and Times"],
        ["register_start_time", "Register Start Time", "date"],
        ["register_end_time", "Register End Time", "date"],
        ["start_time", "Event Start Time", "date"],
        ["end_time", "Event End Time", "date"],

        ["", "Security"],
        ["enable_force_admin_2fa ", "Force 2FA for admins", "boolean"],
        ["enable_maintenance_mode", "Enable Maintanance Mode", "boolean"],
        
        ["", "Event Configuration"],
        ["flag_prefix", "Flag Prefix", "string"],
        
        ["", "Registration Restrictions"],
        ["email_domain", "Email Domain", "string"],
        ["email_regex", "Email Regex", "string"],
        ["invite_required", "Invites required to join", "boolean"],

        ["", "Limit Site Access"],
        ["enable_flag_submission", "Enable Flag Submission", "boolean"],
        ["enable_login", "Enable Login", "boolean"],
        ["enable_registration", "Enable Registration", "boolean"],
        ["enable_flag_submission_after_competition", "Enable flag submission after competition", "boolean"],
        ["enable_view_challenges_after_competion", "Enable challenge viewing after competition", "boolean"],

        ["", "Site Functionality"],
        ["enable_scoreboard", "Enable Scoreboard", "boolean"],
        ["enable_scoring", "Enable Scoring", "boolean"],
        ["enable_solve_broadcast", "Enable Solve Broadcasting", "boolean"],
        ["enable_team_join", "Enable Team Joining", "boolean"],

        ["", "Teams"],
        ["enable_teams", "Enable Teams", "boolean"],
        ["team_size", "Max Team Size", "int"],

        ["", "Integrations"],
        ["enable_ctftime", "Enable CTFTime", "boolean"],
        ["login_provider", "Login provider", "string"],
        ["registration_provider", "Registration provider", "string"],
    ]);
};
