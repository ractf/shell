import React from "react";
import { storiesOf } from '@storybook/react';

import TabbedView from "./TabbedView";

storiesOf("TabbedView", module)
    .add("Default", () => <TabbedView>
        <div label="tab 1">Tab 1</div>
        <div label="tab 2">Tab 2</div>
        <div label="tab 3">Tab 3</div>
    </TabbedView>)
    .add("Centred", () => <TabbedView center>
        <div label="tab 1">Tab 1</div>
        <div label="tab 2">Tab 2</div>
        <div label="tab 3">Tab 3</div>
    </TabbedView>);
