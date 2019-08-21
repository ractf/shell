import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import { SectionTitle } from "../../../components/Misc";

import theme from "theme";


const ListWrap = styled.div`
    flex-grow: 1;
    width: 100%;
    max-width: 1400px;
    margin: auto;
`;
const Table = styled.table`
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    margin-top: ${props => props.title ? "1em" : "0"};
    overflow-x: auto;
`;
const TD = styled.td`
    border-bottom: 1px solid ${transparentize(.27, theme.bg_d1)};
    padding: 8px 16px;
    background-color: ${transparentize(.74, theme.bg_d1)};
    font-size: .9em;
`;
const THead = styled.thead`
    font-weight: 500;

    td {
        background-color: ${transparentize(.27, theme.bg_d1)};
        font-size: 1em;
    }
`;
const TR = styled.tr`
    &:nth-child(2n) > td {
        background-color: ${transparentize(.53, theme.bg_d1)};
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
