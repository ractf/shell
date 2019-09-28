import React from "react";

import { SectionH2, SectionHeading, TextBlock } from "../../../components/Misc";
import ListPage from "./ListPage";

import Page from "./Page"


export default (props) =>
    <Page title={props.title} url={props.website}>
        {props.underTitle
            ? <SectionHeading>69th Place</SectionHeading>
            : null}
        {props.description
            ? <TextBlock>{props.description}</TextBlock>
            : null}

        {props.sections.map(i => (
            <>
                <SectionH2>{i[0]}</SectionH2>
                <ListPage columns={i[1]} data={i[2]} />
            </>
        ))}
    </Page>;
