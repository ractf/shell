import React from "react";
import styled from "styled-components";

import { Page, Table, SectionH2, HR } from "ractf";


const Text = styled.p`
    margin-bottom: 2em;
`

const data = [
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
    ["Nick", "Nothing at all"],
]

export default () => <Page title={"About RACTF"}>
    <Text>RACTF is [insert a bit of interesting text here]</Text>

    <HR />

    <SectionH2>Staff</SectionH2>
    <Table headings={["Member", "Contribution"]} data={data} noSort></Table>
</Page>
