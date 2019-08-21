import React, { useState } from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";

import ListPage from "./bases/ListPage";
import Page from "./bases/Page";

import theme from "theme";


const ListWrap = styled.div`
    flex-grow: 1;
    width: 100%;
    max-width: 1400px;
    margin: auto;
`;

const Table_ = styled.table`
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    overflow-x: auto;
`;
/*
const TD = styled.td`
    border-bottom: 1px solid ${transparentize(.27, theme.bg_d1)};
    padding: 8px 16px;
    background-color: ${transparentize(.74, theme.bg_d1)};
    font-size: .9em;
`;*/
const THead = styled.thead`
    font-weight: 500;

    td {
        background-color: ${transparentize(.27, theme.bg_d1)};
        font-size: 1em;
    }
`;
/*
const TR = styled.tr`
    &:nth-child(2n) > td {
        background-color: ${transparentize(.53, theme.bg_d1)};
    }
`;*/

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

const Arrow = styled.div`
`;

const Table = (props) => {
    const [sortMode, setSortMode] = useState(null);
    const sorter = props.sorter || ((i, j) => (
        j === null ? i :
        i.sort((a, b) => (
            a === b ? 0 :
            (j[1] ? a[j[0]] < b[j[0]] : a[j[0]] > b[j[0]]) * 2 - 1
        ))
    ));

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
                {props.headings.map((i, n) => (
                    <TD key={n} onClick={toggleSort(n)} sortable>{i} <Arrow /></TD>
                ))}
            </TR>
        </thead>
        <tbody>
            {sorter(props.data, sortMode).map((i, n) => (
                <TR key={n}>
                    {i.map((j, m) => <TD key={m}>{j}</TD>)}
                </TR>))}
        </tbody>
    </Table_>
}




export default () => {
    const data = [
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
    ]

    return <Page
        title={"Teams"}>
        <Table headings={["Team", "Country", "Website", "Affiliation"]} data={data} />
    </Page>;

    return <ListPage
        title={"Teams"}
        columns={["Team", "Country", "Website", "Affiliation"]}
        data={[
            ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
            ["Fuck Sai", "", "", ""],
        ]}
    />
}
