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

import { Form, Page, Select, PageHead } from "@ractf/ui-kit";
import { usePreferences } from "@ractf/shell-util";

import { store } from "store";
import { setPreference } from "actions";

import EXPERIMENTS from "./experiments";


const Experiments = () => {
    const [prefs] = usePreferences();

    const onChange = useCallback((changes) => {
        for (const i in changes) {
            if (changes[i] !== prefs[`experiment.${i}`]) {
                store.dispatch(setPreference(`experiment.${i}`, changes[i]));
            }
        }
    }, [prefs]);

    return <Page>
        <PageHead>Experiments</PageHead>
        <Form onChange={onChange}>
            {Object.keys(EXPERIMENTS).map(i => {
                const exp = EXPERIMENTS[i];
                let state = prefs[`experiment.${i}`];
                if (typeof state === "undefined") state = false;
                return <Form.Group key={exp.name} label={exp.name}>
                    <Select
                        options={exp.options} name={i}
                        initial={state} />
                </Form.Group>;
            })}
        </Form>
    </Page>;
};
export default Experiments;
