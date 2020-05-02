import { registerPlugin } from "ractf";


export default () => {
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

        ["", "Limit Site Access"],
        ["enable_flag_submission", "Enable Flag Submission", "boolean"],
        ["enable_login", "Enable Login", "boolean"],
        ["enable_registration", "Enable Registration", "boolean"],

        ["", "Site Functionality"],
        ["enable_scoreboard", "Enable Scoreboard", "boolean"],
        ["enable_scoring", "Enable Scoring", "boolean"],
        ["enable_solve_broadcast", "Enable Solve Broadcasting", "boolean"],
        ["enable_team_join", "Enable Team Joining", "boolean"],

        ["", "Teams"],
        ["enable_teams", "Enable Teams", "boolean"],
        ["team_size", "Max Team Size", "int"],

        ["", "Integratiosn"],
        ["enable_ctftime", "Enable CTFTime", "boolean"],
    ]);
};
