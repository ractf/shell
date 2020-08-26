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

import { Row, Column, Card, Input, FormGroup, ItemStack, Checkbox } from "@ractf/ui-kit";

import * as actions from "../actions.js";

import Challenge from "./Challenge.js";


export const JeopardyChallenges = ({ challenges: category, showEditor, isEdit, showLocked }) => {
    const { showSolved, filter, search } = useSelector(state => state.jeopardySearch);
    const dispatch = useDispatch();

    const tags = {};
    let solved = 0;

    const shouldShow = (challenge, options = {}) => {
        if (!options.ignoreSolved && challenge.solved && !showSolved)
            return false;
        if (!showLocked && !challenge.unlocked)
            return false;

        if (!options.ignoreTags && Object.keys(filter).length !== 0) {
            if (!filter[challenge.author])
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
        if (shouldShow(challenge, { ignoreSolved: true })) {
            solved += challenge.solved;
        }
    }

    const searchChanged = useCallback((value) => {
        dispatch(actions.setJeopardySearch(value));
    }, [dispatch]);
    const toggleFilter = (i) => {
        return () => {
            const newFilter = { ...filter };
            if (filter[i]) delete newFilter[i];
            else newFilter[i] = true;

            dispatch(actions.setJeopardyFilter(newFilter));
        };
    };
    const setShowSolved = useCallback(value => dispatch(actions.setJeopardyShowSolved(value)), [dispatch]);

    const sortedTags = Object.keys(tags).sort((a, b) => a.localeCompare(b)).map(i => [i, tags[i]]);

    return <Row>
        <Column xlWidth={3} lgWidth={4} mdWidth={12}>
            <Card>
                <FormGroup>
                    <Input onChange={searchChanged} value={search}
                        name={"search"} placeholder={"Search challenges"} val={search} managed />
                </FormGroup>
                <Checkbox name={"done"} managed onChange={setShowSolved} val={showSolved}>
                    Show solved challenges ({solved})
                </Checkbox>
            </Card>
            {sortedTags.length !== 0 && (
                <Card noPad header={"Filter"} collapsible>
                    <ItemStack>
                        {sortedTags.map(([tag, tagCount]) => (
                            <ItemStack.Item
                                key={tag} label={tagCount} active={filter[tag]}
                                success={filter[tag]} onClick={toggleFilter(tag)}
                            >
                                {tag}
                            </ItemStack.Item>
                        ))}
                    </ItemStack>
                </Card>
            )}
        </Column>
        <Column xlWidth={9} lgWidth={8} mdWidth={12}>
            {category.challenges.sort((x, y) => x.score - y.score).map(
                i => (shouldShow(i) ? <Challenge category={category} key={i.id} challenge={i} /> : null)
            )}
        </Column>
    </Row>;
};
