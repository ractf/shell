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

import React, { useState, useEffect } from "react";

import { Row, H6 } from "@ractf/ui-kit";
import { registerPlugin, useApi } from "ractf";
import http from "@ractf/http";

const ChallengeRating = ({ challenge }) => {
    const [stars, setStars] = useState(0);

    const hover = (num) => {
        setStars(num);
    }
    const unhover = (num) => {
        setStars(challenge.positive)
    }

    return <Row>
    </Row>;
};


export default () => {
    registerPlugin("challengeMod", "challengeRating", {
        component: ChallengeRating,
        check: (challenge) => challenge.solved
    });
};
