import React from "react";
import { useSelector } from "react-redux";
import { MdWarning } from "react-icons/md";

import { ToggleTab } from "@ractf/ui-kit";

import {useConfig} from "../../../@ractf/shell-util";


const ConfigWarning = () => {
    const user = useSelector(state => state.user);
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};
    const enable_scoring = useConfig("enable_scoring");
    
    if (!user || !user.is_staff) return null;

    if (countdown_passed.countdown_timestamp && !enable_scoring)
        return <ToggleTab Icon={MdWarning} warning>
            Event open but scoring is disabled!
        </ToggleTab>;
    return null;
};
export default React.memo(ConfigWarning);
