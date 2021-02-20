// Copyright (C) 2020-2021 Really Awesome Technology Ltd
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

import {
    Page, Row, PageHead, Column
} from "@ractf/ui-kit";
import { ENDPOINTS } from "@ractf/api";
import { useApi } from "@ractf/util/http";


const Debug = () => {
    const [backendVersion] = useApi(ENDPOINTS.VERSION);

    return <Page>
        <PageHead>Debug Versions</PageHead>
        <Column>
            <Row><code>ractf/shell</code> version: <code>{__COMMIT_HASH__}</code></Row>
            <Row><code>ractf/backend</code> version: <code>{backendVersion && backendVersion.commit_hash}</code></Row>
        </Column>
    </Page>;
};
export default Debug;
