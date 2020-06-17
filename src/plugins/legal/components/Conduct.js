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

import { H1, Page } from "@ractf/ui-kit";


export default () => <Page>
    <H1>Code of Conduct</H1>
    <i>The following rules should be followed at ALL TIMES when you are participating in the CTF. By using this site you
        agree to adhere to these terms unconditionally, violation of these terms may result in your access being revoked
        and/or your account terminated. Really Awesome CTF reserves the right to terminate accounts or revoke any access
        rights at the admin's discretion, without any warning or prior notice.</i>

    <ul>
        <li>Attacking anything other than the provided targets is out of scope. We are monitoring the CTF closely and
            will revoke access of anyone appearing to be attempting to attack the scoreboard, other participants, or the
            infrastructure beyond the provided targets.</li>
        <li>Purposeful attempts to disrupt the CTF, hack unintended systems, or hack other participants will result in
            immediate termination of your Really Awesome CTF account.</li>
        <li>The challenge briefings will provide you with the endpoints you are permitted to target. To complete the
            challenge you do not need to target anything outside the provided endpoint. Do not attempt to hack
            anything other than the provided, specified targets. No challenge requires a container escape.</li>
        <li>If you are not sure if something you want to try is within scope, <b>*ASK first*</b> by DMing a Team Member
            on Discord.</li>
        <li>If you suspect something is broken or find a bug you want to report, please DM a Team Member on
            Discord.</li>
    </ul>
</Page>;
