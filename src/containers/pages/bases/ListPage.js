import React from "react";
import styled from "styled-components";

import { SectionTitle } from "../../../components/Misc";


const ListWrap = styled.div`
    flex-grow: 1;
    width: 100%;
`;
const Table = styled.table`
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    margin-top: ${props => props.title ? "1em" : "0"};
    overflow-x: auto;
`;
const TD = styled.td`
    border-bottom: 1px solid #111023bb;
    padding: 8px 16px;
    background-color: #11102344;
    font-size: .9em;
`;
const THead = styled.thead`
    font-weight: 500;

    td {
        background-color: #111023bb;
        font-size: 1em;
    }
`;
const TR = styled.tr`
    &:nth-child(2n) > td {
        background-color: #11102377;
    }
`;

export default (props) => {
    return <ListWrap>
        {props.title
            ? <SectionTitle>{props.title}</SectionTitle>
            : null}
        <Table {...props}>
            <THead>
                <tr>
                    {props.columns.map(i => <TD>{i}</TD>)}
                </tr>
            </THead>
            <tbody>
                {props.data.map(i => <TR>
                    {i.map(j => <TD>{j}</TD>)}
                </TR>)}
            </tbody>
        </Table>
    </ListWrap>;
}
