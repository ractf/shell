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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
     Table, Button, Container, Form
} from "@ractf/ui-kit";
import { usePaginated } from "@ractf/util/http";

import { BrokenShards } from "../pages/ErrorPages";


export const PaginatedTable = ({ headers, defaultOrdering, endpoint, transformerFunction }) => {

    const [ordering, setOrdering] = useState(defaultOrdering);
    const [state, next] = usePaginated(endpoint, {orderBy: ordering});
    const { t } = useTranslation();

    const setOrderingFromHeaderName = (name) => {
        let orderBy = headers[name];

        if (ordering.charAt(0) !== "-") {
            orderBy = "-" + orderBy;
        }

        setOrdering(orderBy);
    };

    return state.error ? <Container full centre>
        <Form.Error>
            {t("lists.paginated_error")}<br />{t("lists.try_reload")}
            </Form.Error>
            <BrokenShards/>
        </Container> : <> 
        <Table onHeaderClick={setOrderingFromHeaderName} headings={
            Object.keys(headers)
        } data={
            state.data.map(transformerFunction)
        } />
        {state.hasMore && (<Container full centre>
            <Button disabled={state.loading} onClick={() => { next(); }}>{t("load_more")}</Button>
        </Container>)}
    </>
    ;
};

export default PaginatedTable;
