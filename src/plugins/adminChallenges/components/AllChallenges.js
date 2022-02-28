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

import { PageHead, Table } from "@ractf/ui-kit";
import { useCategories } from "@ractf/shell-util";


const calcPercentage = (challenge) => {
    const rating = Math.round(
        (challenge.votes.positive / (challenge.votes.positive + challenge.votes.negative)) * 1000
    ) / 10;
    return isNaN(rating) ? null : rating;
};

const AllChallenges = () => {
    const categories = useCategories();
    const challenges = categories.flatMap(i => i.challenges);

    const serializeChallenges = () => {
        return challenges.map((chal) => {
            return [chal.name, chal.author, chal.current_score ?? chal.score, chal.solve_count, chal.first_blood,
                    calcPercentage(chal)];
        });
    };

    return <>
        <PageHead title={"All Challenges"} />
        <Table headings={["Name", "Author", "Points", "Solves", "Blood", "Rating"]}
               data={serializeChallenges()}></Table>
    </>;
};

export default AllChallenges;
