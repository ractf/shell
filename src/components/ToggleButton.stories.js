import React from "react";
import { storiesOf } from '@storybook/react';

import ToggleButton from "./ToggleButton";

storiesOf("ToggleButton", module)
    .add("Default", () => <ToggleButton options={[["Option 1", 0], ["Option 2", 1]]}/>)
    .add("With Title", () => <ToggleButton options={[["Option 1", 0], ["Option 2", 1]]}>
        Toggle Title
    </ToggleButton>);
