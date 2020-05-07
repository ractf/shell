import React, { useState } from "react";

import { Link } from "./Link";

import "./Table.scss";


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
        };
    };

    return <div className={"tableWrap"}><table>
        <thead>
            <tr className={"heading"}>
                {headings.map((i, n) => (
                    <td key={n} onClick={noSort || toggleSort(n)} className={noSort ? "" : "sortable"}>
                        <span>{i}</span>
                    </td>
                ))}
            </tr>
        </thead>
        <tbody>
            {sorterFunc(data, sortMode).map((i, n) => (
                <tr key={n}>
                    {i.slice(0, headings.length).map(
                        (j, m) => <td key={m}>
                            {i.length > headings.length ? <Link to={i[i.length - 1]}>{j}</Link> : <span>{j}</span>}
                        </td>
                    )}
                </tr>))}
        </tbody>
    </table></div>;
};
