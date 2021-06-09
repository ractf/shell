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

import React, { useState } from "react";
import { useSelector } from "react-redux";

import { usePaginated } from "@ractf/util/http";
import { useInterval } from "@ractf/util";
import { ENDPOINTS } from "@ractf/api";

import style from "./LargeLeaderboard.module.scss";


const LargeLeaderboard = () => {
    const { dates: countdown_dates } = useSelector(state => state.countdowns) || {};
    const [uState, uNext] = usePaginated(ENDPOINTS.LEADERBOARD_USER);
    const [countdownText, setCountdownText] = useState("");

    const pad = n => ((n < 10) ? "0" : "") + n;
    useInterval(() => {
        if (!countdown_dates) {
            return setCountdownText("");
        }

        const now = new Date();
        let delta = ((new Date(countdown_dates.competition_end)) - now) / 1000;
        delta = Math.max(0, delta);
        const days = Math.floor(delta / 86400);
        const hours = Math.floor((delta % 86400) / 3600);
        const minutes = Math.floor((delta % 3600) / 60);
        const seconds = Math.floor((delta % 60));

        setCountdownText(("" + days) + " day" + (days === 1 ? "" : "s") + ", "
            + pad(hours) + " hour" + (hours === 1 ? "" : "s") + ", "
            + pad(minutes) + " minute" + (minutes === 1 ? "" : "s") + ", "
            + pad(seconds) + " second" + (seconds === 1 ? "" : "s"));
    }, 100);

    const userData = uState.data.map((i, n) => [n + 1, i.username, i.leaderboard_points]);

    return <div className={style.background}>
        <div className={style.wrapper}>
            <div className={style.header}>
                <div className={style.siteName}>
                    {window.env.siteName}
                </div>
                <div className={style.countDown}>
                    {countdownText}
                </div>
            </div>
            <div className={style.board}>
                <table>
                    <thead>
                        <tr>
                            <td>Place</td>
                            <td>Player Name</td>
                            <td>Points</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map(([place, username, points]) => (
                            <tr key={place}>
                                <td>{place}</td>
                                <td>{username}</td>
                                <td>{points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {uState.hasMore && !uState.loading && <div className={style.button} onClick={uNext}>
                    Load more
                </div>}
            </div>
        </div>
    </div>;
};
export default React.memo(LargeLeaderboard);
