import { registerPlugin } from "ractf";

import MembersList from "./components/MembersList";
import TeamsList from "./components/TeamsList";


export default () => {
    registerPlugin("adminPage", "members", {
        component: MembersList,
        sidebar: "Members",
    });
    registerPlugin("adminPage", "teams", {
        component: TeamsList,
        sidebar: "Teams",
    });
};
