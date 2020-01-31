import React from "react";
import { storiesOf } from '@storybook/react';

import TabbedView, { Tab } from "./TabbedView";

storiesOf("TabbedView", module)
    .add("Default", () => <TabbedView>
        <Tab label="tab 1">Tab 1</Tab>
        <Tab label="tab 2">Tab 2</Tab>
        <Tab label="tab 3">Tab 3</Tab>
    </TabbedView>)
    .add("Centred", () => <TabbedView center>
        <Tab label="tab 1">Tab 1</Tab>
        <Tab label="tab 2">Tab 2</Tab>
        <Tab label="tab 3">Tab 3</Tab>
    </TabbedView>);
