import React, { useState } from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";

import theme from "theme";

const Table_ = styled.table`
width: 100%;
text-align: left;
border-collapse: collapse;
overflow-x: auto;
`;
const TR = styled.tr`
> td {
    ${props => props.heading && css`
        background-color: ${transparentize(.67, theme.bg_d1)};
        font-weight: 500;
    `}
}

&:nth-child(2n) > td {
    background-color: ${transparentize(.67, theme.bg_d1)};
}
${props => !props.heading && css`
    &:last-child > td {
        border: none;
    }

    > td {
        color: #eee;
    }

    &:hover > td {
        color: #fff;
        background-color: ${transparentize(.4, theme.bg_d1)};
    }
`}
`;

const TD = styled.td`
background-color: ${transparentize(.87, theme.bg_d1)};
border-bottom: 1px solid ${transparentize(.53, theme.bg_d1)};
vertical-align: top;
padding: .75rem;

${props => props.sortable && css`
    position: relative;
    cursor: pointer;
    padding-right: 1.5rem;

    &::before, &::after {
        border: 4px solid transparent;
        content: "";
        display: block;
        height: 0;
        right: .75rem;
        top: 50%;
        position: absolute;
        width: 0;
    }
    &::before {
        border-bottom-color: #999;
        margin-top: -9px;
    }
    &::after {
        border-top-color: #999;
        margin-top: 1px;
    }

    &:hover::before {
        border-bottom-color: #ccc;
    }
    &:hover::after {
        border-top-color: #ccc;
    }
`}
`;

export default ({ sorter, headings, data, noSort }) => {
    const [sortMode, setSortMode] = useState(null);
    let sorterFunc;
    if (!noSort)
        sorterFunc = sorter || ((i, j) => (
            j === null ? i :
                i.sort((a, b) => (
                    a === b ? 0 :
                        (j[1] ? a[j[0]] < b[j[0]] : a[j[0]] > b[j[0]]) * 2 - 1
                ))
        ));
    else sorterFunc = x => x;

    const toggleSort = n => {
        return e => {
            e.preventDefault();
            if (sortMode !== null && sortMode[0] === n)
                setSortMode([n, !sortMode[1]]);
            else
                setSortMode([n, true]);
        }
    }

    return <Table_>
        <thead>
            <TR heading>
                {headings.map((i, n) => (
                    <TD key={n} onClick={noSort && toggleSort(n)} sortable={!noSort}>{i}</TD>
                ))}
            </TR>
        </thead>
        <tbody>
            {sorterFunc(data, sortMode).map((i, n) => (
                <TR key={n}>
                    {i.map((j, m) => <TD key={m}>{j}</TD>)}
                </TR>))}
        </tbody>
    </Table_>
}
