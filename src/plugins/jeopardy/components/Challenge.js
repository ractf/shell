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

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, Markdown, Row, HR } from "@ractf/ui-kit";

import { setJeopardyOpenCards } from "../actions";

import FlagForm from "@ractf/plugins/FlagForm";


const Challenge = ({ challenge }) => {
    const openCards = useSelector(state => state.jeopardySearch.openCards) || {};
    const dispatch = useDispatch();

    const onOpenToggle = useCallback((open) => {
        const newOpenCards = {...openCards};
        if (open) newOpenCards[challenge.id] = true;
        else delete newOpenCards[challenge.id];
        dispatch(setJeopardyOpenCards(newOpenCards));
    }, [challenge.id, openCards, dispatch]);

    return <Card
        header={`${challenge.name} (${challenge.score} points)`} success={challenge.solved}
        framed collapsible startClosed open={openCards[challenge.id]} onOpenToggle={onOpenToggle}
    >
        <Row>
            <Markdown source={challenge.description} />
        </Row>
        <HR />
        <Row>
            <Button width={"100%"} to={challenge.url}>Open challenge page</Button>
        </Row>
        <Row>
            <FlagForm challenge={challenge} />
        </Row>
    </Card>;
};
export default Challenge;
