import React from "react";
import { useSelector } from "react-redux";
import { MdWarning } from "react-icons/md";
import { ToggleTab } from "@ractf/ui-kit";

const LockWarning = () => {
    const user = useSelector(state => state.user);
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};
    
    if (!user || !user.is_staff) return null;

    if (!countdown_passed.registration_open)
        return <ToggleTab Icon={MdWarning} danger>
            Registration locked!
        </ToggleTab>;
    if (!countdown_passed.countdown_timestamp)
        return <ToggleTab Icon={MdWarning} warning>
            Challenges locked!
        </ToggleTab>;
    return null;
};
export default React.memo(LockWarning);
