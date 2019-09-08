import React from "react";
import { storiesOf } from '@storybook/react';

import * as Misc from "./Misc";

storiesOf("Misc", module)
    .add("HR", () => <Misc.HR />)
    .add("SectionTitle", () => <Misc.SectionTitle>SectionTitle</Misc.SectionTitle>)
    .add("SectionTitle2", () => <Misc.SectionTitle2>SectionTitle2</Misc.SectionTitle2>)
    .add("SectionH2", () => <Misc.SectionH2>SectionH2</Misc.SectionH2>)
    .add("SectionSub", () => <Misc.SectionSub>SectionSub</Misc.SectionSub>)
    .add("TextBlock", () => <Misc.TextBlock>TextBlock<br/>TextBlock</Misc.TextBlock>)
    .add("SectionBlurb", () => <Misc.SectionBlurb>SectionBlurb<br/>SectionBlurb</Misc.SectionBlurb>);
