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
import { useReactRouter } from "@ractf/util";

import { Page } from "@ractf/ui-kit";
import { plugins } from "ractf";


const AdminPage = () => {
    const { match } = useReactRouter();
    if (!match) return null;
    const page = match.params.page;

    let content;
    if (plugins.adminPage && plugins.adminPage[page]) {
        content = React.createElement(plugins.adminPage[page].component);
    }

    return <Page>
        {content}
    </Page>;
};
export default AdminPage;
