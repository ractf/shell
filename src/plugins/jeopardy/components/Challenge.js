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

import React, { useCallback, useState, useRef } from "react";

import { Card } from "@ractf/ui-kit";

import { store } from "store";
import ChallengePage from "pages/ChallengePage";

import { setJeopardyOpenCards } from "../actions";


const Challenge = ({ challenge }) => {
    const startOpen = (store.getState().jeopardySearch?.openCards[challenge.id]) || false;
    const [renderCard, setRenderCard] = useState(startOpen);
    const contentClearTimeout = useRef();

    const onOpenToggle = useCallback((open) => {
        if (open) { clearTimeout(contentClearTimeout.current); }
        contentClearTimeout.current = setTimeout(() => { 
            setRenderCard(open);
        }, open ? 0 : 500);

        const newOpenCards = {...store.getState().jeopardySearch.openCards};
        if (open) newOpenCards[challenge.id] = true;
        else delete newOpenCards[challenge.id];
        store.dispatch(setJeopardyOpenCards(newOpenCards));
    }, [challenge.id]);

    return <Card
        header={`${challenge.name} (${challenge.current_score ?? challenge.score} points)`} lesser
        collapsible startClosed={!startOpen} onOpenToggle={onOpenToggle}
        success={challenge.solved} danger={challenge.hidden} warning={!challenge.unlocked && !challenge.hidden}
    >
        {renderCard && <ChallengePage tabId={challenge.category.id} chalId={challenge.id} embedded />}
    </Card>;
};
export default React.memo(Challenge);
