import React from "react";
import { useSelector } from "react-redux";
import { MdWarning } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { ToggleTab } from "@ractf/ui-kit";

import { useConfig } from "../../../@ractf/shell-util";


const ConfigWarning = () => {
    const user = useSelector(state => state.user);
    const countdown_passed = useSelector(state => state.countdowns?.passed) || {};
    const enable_scoring = useConfig("enable_scoring");
    const enable_flag_submission = useConfig("enable_flag_submission");
    const enable_maintenance_mode = useConfig("enable_maintenance_mode");
    const { t } = useTranslation();
    
    if (!user || !user.is_staff) return null;

    const warnings = [];

    if (countdown_passed.countdown_timestamp && !enable_scoring) {
        warnings.push(<ToggleTab Icon={MdWarning} warning>
            { t("admin.warnings.scoring_disabled_during_event") }
        </ToggleTab>);
    }
    if (countdown_passed.countdown_timestamp && !enable_flag_submission) {
        warnings.push(<ToggleTab Icon={MdWarning} warning>
            { t("admin.warnings.flag_submission_disabled_during_event") }
        </ToggleTab>);
    }
    if (enable_maintenance_mode) {
        warnings.push(<ToggleTab Icon={MdWarning} warning>
            { t("admin.warnings.maintenance_mode") }
        </ToggleTab>);
    }
    return warnings;
};
export default React.memo(ConfigWarning);
