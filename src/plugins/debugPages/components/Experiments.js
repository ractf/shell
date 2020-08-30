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

import { Form, Page, Select, Column, PageHead, FormGroup } from "@ractf/ui-kit";
import { usePreferences } from "@ractf/util/hooks";
import { setPreference } from "actions";
import { store } from "store";


const EXPERIMENTS = {
    "showDev": {
        name: "Show developer links in navigations",
        options: [{ key: true, value: "Enabled" }, { key: false, value: "Disabled" }]
    },
    "accDeletion": {
        name: "Account deletion",
        options: [{ key: true, value: "Enabled" }, { key: false, value: "Disabled" }]
    },
    "accOauth": {
        name: "OAuth Providers",
        options: [{ key: true, value: "Enabled" }, { key: false, value: "Disabled" }]
    },
    "importEntire": {
        name: "Import Entire CTF",
        options: [{ key: true, value: "Enabled" }, { key: false, value: "Disabled" }]
    },
    "advSearch": {
        name: "Advanced Team/Member Search",
        options: [{ key: true, value: "Enabled" }, { key: false, value: "Disabled" }]
    },
};

const Experiments = () => {
    const [prefs] = usePreferences();

    const onChange = useCallback((changes) => {
        for (const i in changes) {
            if (changes[i] !== prefs["experiment." + i]) {
                store.dispatch(setPreference("experiment." + i, changes[i]));
            }
        }
    }, [prefs]);

    return <Page>
        <PageHead>Experiments</PageHead>
        <Column>
            <Form onChange={onChange}>
                {Object.keys(EXPERIMENTS).map(i => {
                    const exp = EXPERIMENTS[i];
                    let state = prefs["experiment." + i];
                    if (typeof state === "undefined") state = false;
                    return <FormGroup key={exp.name} label={exp.name}>
                        <Select
                            options={exp.options} name={i}
                            initial={exp.options.map(j => j.key).indexOf(state)} />
                    </FormGroup>;
                })}
            </Form>
        </Column>
    </Page>;
};
export default Experiments;
