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
import FlagForm from "@ractf/plugins/FlagForm";

import { setJeopardyOpenCards } from "../actions";

import { store } from "store";

import File from "plugins/standardChallenge/components/File";
import Hint from "plugins/standardChallenge/components/Hint";


const Challenge = ({ challenge }) => {
    const openCards = useSelector(state => state.jeopardySearch.openCards) || {};
    const dispatch = useDispatch();

    const onOpenToggle = useCallback((open) => {
        const newOpenCards = {...store.getState().jeopardySearch.openCards};
        if (open) newOpenCards[challenge.id] = true;
        else delete newOpenCards[challenge.id];
        dispatch(setJeopardyOpenCards(newOpenCards));
    }, [challenge.id, dispatch]);

    return <Card
        header={`${challenge.name} (${challenge.score} points)`} framed
        collapsible startClosed open={openCards[challenge.id]} onOpenToggle={onOpenToggle}
        success={challenge.solved} danger={challenge.hidden} warning={!challenge.unlocked && !challenge.hidden} 
    >
        <Row>
            <Markdown source={challenge.description} />
        </Row>
        {(challenge.files.length || challenge.hints.length) && <br />}
        {!!challenge.files.length && <Row>
            {challenge.files.map(file => <File {...file} key={file.id} tiny />)}
        </Row>}
        {!!challenge.hints.length && <Row>
            {challenge.hints.map(hint => <Hint {...hint} key={hint.id} tiny />)}
        </Row>}
        {challenge.challenge_metadata?.cserv_name && <Row>
            <SubtleText>
                This challenge uses a network socket - open the challenge page for more details.
            </SubtleText>
        </Row>}
        <Row>
            <Button to={challenge.url}>Open challenge page</Button>
            <FlagForm challenge={challenge} />
        </Row>
    </Card>;
};
export default Challenge;
