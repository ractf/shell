import React from "react";

import { SectionTitle } from "../../../components/Misc";

import Table from "../../../components/Table";

import "./ListPage.scss";


export default ({ title, columns, data }) => {
    return <div className={"listWrap"}>
        {title
            ? <SectionTitle>{title}</SectionTitle>
            : null}
        <Table headings={columns} data={data} />
    </div>;
}
