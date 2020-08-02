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

import { Network, Node, Edge } from "react-vis-network";
import { PageHead } from "@ractf/ui-kit";

import colours from "@ractf/ui-kit/Colours.scss";

import style from "./ChallengeGraph.module.scss";
import { useCategories } from "@ractf/util/hooks";

const ChallengeGraph = () => {
    const categories = useCategories();

    const unlockedBy = {};
    const solvesCount = {};
    categories.forEach(category => category.challenges.forEach(challenge => {
        solvesCount[challenge.id] = challenge.solve_count;
        challenge.unlocks.forEach(unlocks => {
            (unlockedBy[unlocks] = unlockedBy[unlocks] || []).push(challenge.id);
        });
    }));
    const unlocksMapped = [];

    return <div className={style.networkOuter}>
        <PageHead>Challenge Graph</PageHead>
        <div className={style.network}>
            <Network>
                {categories.map(category => <Node
                    id={`category_${category.id}`}
                    key={`category_${category.id}`}
                    label={category.name}
                    color={colours.blue}
                    widthConstraint={{ maximum: 100 }}
                />)}
                {categories.flatMap(category => category.challenges.flatMap(challenge => [
                    <Node
                        id={`challenge_${challenge.id}`}
                        key={`challenge_${challenge.id}`}
                        label={challenge.name}
                        color={challenge.hidden ? colours.red : colours.green}
                        shape={"box"} widthConstraint={{ maximum: 150 }}
                    />,
                    challenge.auto_unlock ? (
                        <Edge
                            id={`link_category_${category.id}_challenge_${challenge.id}`}
                            key={`link_category_${category.id}_challenge_${challenge.id}`}
                            from={`category_${category.id}`} to={`challenge_${challenge.id}`}
                            dashes value={challenge.solve_count}
                        />
                    ) : null,
                    ...challenge.unlocks.map(unlocks => {
                        const bidirectional = unlockedBy[challenge.id].indexOf(unlocks) !== -1;

                        for (const i of unlocksMapped) {
                            if (i[0] === challenge.id && i[1] === unlocks)
                                return null;
                        }

                        unlocksMapped.push([challenge.id, unlocks]);
                        if (bidirectional)
                            unlocksMapped.push([unlocks, challenge.id]);

                        return (
                            <Edge arrows={bidirectional ? undefined : "middle"}
                                id={`link_challenge_${challenge.id}_challenge_${unlocks}`}
                                key={`link_challenge_${challenge.id}_challenge_${unlocks}`}
                                from={`challenge_${challenge.id}`} to={`challenge_${unlocks}`}
                                value={solvesCount[unlocks]}
                            />
                        );
                    })
                ])).filter(Boolean)}
            </Network>
        </div>
    </div>;
};
export default React.memo(ChallengeGraph);
