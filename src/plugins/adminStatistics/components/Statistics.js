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

import {
    PageHead, Row, Column, Card, Large, HR, Bar, Pie
} from "@ractf/ui-kit";
import colours from "@ractf/ui-kit/Colours.scss";

import style from "./Statistics.module.scss";


const Statistics = () => {
    return <>
        <PageHead title={"Statistics"} />
        <Row>
            <Column lgWidth={6} mdWidth={12}>
                <Card header={"Quick breakdown"}>
                    <Large><b>1</b> registered user</Large>
                    <Large><b>2</b> registered teams</Large>
                    <Large><b>2</b> unique IPs</Large>
                    <HR />
                    <Large><b>2</b> total points</Large>
                    <Large><b>2</b> challenges unlocked, <b>1</b> locked</Large>
                    <Large><b>2</b> has the most solves, at 0</Large>
                    <Large><b>2</b> has the fewest solves, at 0</Large>
                </Card>
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                <Card header={"Solve count"}>
                    <Bar className={style.smallChart} yLabel={"Solves"} data={{ some: 5, help_me: 4, here: 9 }} />
                </Card>
            </Column>
            <Column lgWidth={12}>
                <Card header={"Score distribution"}>
                    <Bar className={style.chart} yLabel={"Solves"} data={{ some: 5, help_me: 4, here: 9 }} />
                </Card>
            </Column>
            <Column lgWidth={12}>
                <Card header={"Solve percentage"}>
                    <Bar className={style.chart} yLabel={"Percentage of teams"} yMax={100}
                        data={{ some: 5, help_me: 4, here: 9 }} />
                </Card>
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                <Card header={"Solve accuracy"}>
                    <Pie className={style.chart} data={[5, 7]}
                        labels={["Correct", "Incorrect"]}
                        colors={[colours.green, colours.red]} />
                </Card>
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                <Card header={"Category breakdown"}>
                    <Pie className={style.chart} data={[69, 420]}
                        labels={["Fuk", "ewe"]} />
                </Card>
            </Column>
        </Row>
    </>;
};
export default Statistics;
