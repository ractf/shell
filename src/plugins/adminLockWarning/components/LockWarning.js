import React from "react";
import { useSelector } from "react-redux";
import { MdWarning } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { ToggleTab } from "@ractf/ui-kit";


const LockWarning = () => {
    const user = useSelector(state => state.user);
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};
    const { t } = useTranslation();
    
    if (!user || !user.is_staff) return null;

    if (!countdown_passed.registration_open)
        return <ToggleTab Icon={MdWarning} danger>
            { t("admin.warnings.registration_locked") }
        </ToggleTab>;
    if (!countdown_passed.countdown_timestamp)
        return <ToggleTab Icon={MdWarning} warning>
            { t("admin.warnings.challenges_locked") }
        </ToggleTab>;
    return null;
};
export default React.memo(LockWarning);
