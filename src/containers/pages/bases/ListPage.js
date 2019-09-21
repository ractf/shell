import React from "react";
import styled from "styled-components";

import { SectionTitle } from "../../../components/Misc";

import Table from "../../../components/Table";


const ListWrap = styled.div`
    flex-grow: 1;
    width: 100%;
    max-width: 1400px;
    margin: auto;
`;

export default ({ title, columns, data }) => {
    return <ListWrap>
        {title
            ? <SectionTitle>{title}</SectionTitle>
            : null}
        <Table headings={columns} data={data} />
    </ListWrap>;
}
