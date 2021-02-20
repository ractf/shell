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

import React, { useEffect, useState } from "react";

import { Column, Row, Input, Button, Modal, Masonry } from "@ractf/ui-kit";

import ChallengePage from "pages/ChallengePage.js";
import ChallengeTile from "./ChallengeTile.js";


export const TilesChallenges = ({ challenges: category, showEditor, isEdit, showLocked }) => {
    const [challenge, setChallenge] = useState(null);
    const [filter, setFilter] = useState({});
    const [search, setSearch] = useState("");

    const tags = {};

    const shouldShow = (challenge, options = {}) => {

        if (!options.ignoreTags && Object.keys(filter).length !== 0) {
            let hasATag = false;
            for (const i of challenge.tags) {
                if (filter[i]) {
                    hasATag = true;
                    break;
                }
            }
            if (!hasATag)
                return false;
        }

        if (search === null || search.length === 0)
            return true;
        if (challenge.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
            return true;
        if (challenge.description.toLowerCase().indexOf(search.toLowerCase()) !== -1)
            return true;

        return false;
    };
    for (const challenge of category.challenges) {
        for (const tag of challenge.tags) {
            if (!tags[tag]) tags[tag] = 0;
            if (shouldShow(challenge, { ignoreTags: true })) {
                tags[tag]++;
            }
        }
    }

    const toggleFilter = (i) => {
        return () => {
            const newFilter = { ...filter };
            if (filter[i]) delete newFilter[i];
            else newFilter[i] = true;

            setFilter(newFilter);
        };
    };
    // Refresh filter
    useEffect(() => {
        const newFilter = { ...filter };
        let changed = false;
        for (const i in filter) {
            if ((typeof tags[i]) === "undefined") {
                if (filter[i]) {
                    delete newFilter[i];
                    changed = true;
                }
            }
        }
        if (changed)
            setFilter(newFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags]);

    const sortedTags = Object.keys(tags).sort((a, b) => a.localeCompare(b)).map(i => [i, tags[i]]);

    return <Column>
        {challenge && (
            <Modal transparent onClose={() => setChallenge(null)}
                cancel={false} header={challenge.name}
                okay={"Back"} onConfirm={() => setChallenge(null)}
            >
                <ChallengePage tabId={category.id} chalId={challenge.id} />
            </Modal>
        )}
        <Row>
            <Input onChange={setSearch} value={search}
                name={"search"} placeholder={"Search challenges"} val={search} managed />
        </Row>
        {sortedTags.length !== 0 && (
            <Row>
                {sortedTags.map(([tag, tagCount]) => (
                    <Button key={tag}
                        Icon={props => <span {...props}>{tagCount}</span>}
                        onClick={toggleFilter(tag)} success={filter[tag]}
                    >{tag}</Button>
                ))}
            </Row>
        )}
        <Masonry>
            {category.challenges.sort((x, y) => x.score - y.score).map(
                i => (shouldShow(i) ? <ChallengeTile
                    category={category} key={i.id} challenge={i}
                    setChallenge={setChallenge}
                /> : null)
            )}
        </Masonry>
    </Column>;
};
