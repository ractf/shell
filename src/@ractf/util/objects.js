// Copyright (C) 2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

export const copyObj = (a) => {
    const copied = {};
    Object.keys(a).forEach(key => {
        if (typeof a[key] === "object")
            copied[key] = copyObj(a[key]);
        else copied[key] = a[key];
    });
    return copied;
};

export const unmergeObj = (a, b, start = true) => {
    const unmerged = {};
    Object.keys(a).forEach(key => {
        if (typeof a[key] === "object") {
            if (!(unmerged[key] = unmergeObj(a[key] || {}, b[key] || {}, false))) {
                delete unmerged[key];
            }
        } else if (a[key] !== b[key])
            unmerged[key] = a[key];
    });
    if (Object.keys(unmerged).length === 0 && !start)
        return null;
    return unmerged;
};

export const mergeObj = (a, b, start = true) => {
    const merged = start ? copyObj(a) : a;
    Object.keys(b).forEach(key => {
        if (typeof b[key] === "object")
            merged[key] = mergeObj(merged[key] || {}, b[key], false);
        else merged[key] = b[key];
    });
    return merged;
};

export const mergeObjInto = (a, b) => {
    Object.keys(b).forEach(key => {
        if (typeof b[key] === "object") {
            a[key] = a[key] || {};
            mergeObjInto(a[key], b[key]);
        } else a[key] = b[key];
    });
};
