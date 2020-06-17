// Copyright (C) 2020 Really Awesome Technology Ltd
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

import React from "react";

import { plugins } from "ractf";

import "./Style.scss";


export default ({ popup }) => {
    const medal = plugins.medal[popup.medal];
    if (!medal) return <div className={"medalWrap"}>Unknown medal type '{popup.medal}'</div>;

    return <div className={"medalOuterWrap"}>
        <div className={"medalWrap"}>
            <div>{ medal.name }</div>
            <div>{ medal.description }</div>
        </div>
        <div className={"medalIcon"}>{ medal.icon }</div>
    </div>;
};
