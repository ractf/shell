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

import { Card, Button, Markdown, Row, SubtleText } from "@ractf/ui-kit";

import { setJeopardyOpenCards } from "../actions";

import FlagForm from "@ractf/plugins/FlagForm";
import { store } from "store";


const Challenge = ({ challenge }) => {
    const openCards = useSelector(state => state.jeopardySearch.openCards) || {};
    const dispatch = useDispatch();

    const onOpenToggle = useCallback((open) => {
        const newOpenCards = {...store.getState().jeopardySearch.openCards};
        if (open) newOpenCards[challenge.id] = true;
        else delete newOpenCards[challenge.id];
        dispatch(setJeopardyOpenCards(newOpenCards));
    }, [challenge.id, dispatch]);

    const additional = [];
    if (challenge.files.length > 0)
        additional.push("files");
    if (challenge.hints.length > 0)
        additional.push("hints");
    const additionalWarning = (
        `This challenge has additional ${additional.join(" and ")} - open the challenge page to view them.`
    );

    return <Card
        header={`${challenge.name} (${challenge.score} points)`} framed
        collapsible startClosed open={openCards[challenge.id]} onOpenToggle={onOpenToggle}
        success={challenge.solved} danger={challenge.hidden} warning={!challenge.unlocked && !challenge.hidden} 
    >
        <Row>
            <Markdown source={challenge.description} />
            {additional.length !== 0 && (
                <SubtleText>{additionalWarning}</SubtleText>
            )}
            {challenge.challenge_metadata?.cserv_name && <SubtleText>
                This challenge uses a network socket - open the challenge page for more details.
            </SubtleText>}
        </Row>
        <Row>
            <Button to={challenge.url}>Open challenge page</Button>
            <FlagForm challenge={challenge} />
        </Row>
    </Card>;
};
export default Challenge;
