import React from "react";

import { Page, Table, SectionH2, HR } from "ractf";


const data = [
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
]

export default () => <Page title={"About RACTF"}>
    <p>RACTF is [insert a bit of interesting text here]</p>

    <HR />

    <SectionH2>Staff</SectionH2>
    <Table headings={["Member", "Contribution"]} data={data} noSort></Table>
</Page>