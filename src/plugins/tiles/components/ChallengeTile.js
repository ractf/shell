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

import { Markdown } from "@ractf/ui-kit";

import style from "./ChallengeTile.module.scss";
import { makeClass } from "@ractf/util";
import Link from "components/Link";


const DIFFICULTIES = [
    // Points, Name, Colour
    [50, "Trivial", "blue"],
    [100, "Easy", "green"],
    [200, "Medium", "orange"],
    [500, "Hard", "red"],
    [1000, "Insane", "purple"],
];


const ChallengeTile = ({ setChallenge, challenge }) => {
    let difficulty = 0;
    for (let i = 0; i < DIFFICULTIES.length; i++) {
        if (challenge.score >= DIFFICULTIES[i][0])
            difficulty = i;
    }
    const onClick = useCallback(() => {
        setChallenge(challenge);
    }, [setChallenge, challenge]);

    return <div className={makeClass(style.tile, challenge.solved && style.solved)} onClick={onClick}>
        <div className={style.tileHead}>
            <div className={style.headMain}>
                <div className={style.title}>{challenge.name}</div>
                <div className={makeClass(style.subtitle, style[DIFFICULTIES[difficulty][2]])}>
                    <div className={style.dots}>
                        {([...new Array(difficulty)]).map((i, n) => (
                            <div className={style.dot} key={n} />
                        ))}
                    </div>
                    <span>{DIFFICULTIES[difficulty][1]}</span>
                </div>
            </div>
            <div>
                <div className={style.points}>{challenge.score}</div>
                <div className={style.pointsSub}>points</div>
            </div>
        </div>
        <div className={style.tileBody}>
            <Markdown LinkElem={Link} source={challenge.description} />
        </div>
    </div>;
};
export default React.memo(ChallengeTile);
