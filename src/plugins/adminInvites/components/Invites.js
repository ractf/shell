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

import React, { useCallback, useState } from "react";

import {
    Button, Column, PageHead, Card, Form, Input, InputButton,
    Modal, Grid, Checkbox, Select, SubtleText, Container
} from "@ractf/ui-kit";
import { NUMBER_RE } from "@ractf/util";
import * as http from "@ractf/util/http";

import { GENERATE_INVITES, INVITES, generateInvites } from "../api/invites";


const Invites = () => {
    const [invites, setInvites] = useState([]);
    const [locked, setLocked] = useState(false);
    const [onlyUnused, setOnlyUnused] = useState(false);
    const [limit, setLimit] = useState(100);
    const [iState, iNext] = http.usePaginated(
        INVITES + (onlyUnused ? "?fully_used=false" : ""),
        { limit: limit, autoLoad: false }
    );

    const generate = useCallback((amount) => {
        setLocked(true);
        return generateInvites({ amount }).then(codes => {
            setInvites(codes);
            setLocked(false);
        }).catch(e => {
            setLocked(false);
            throw e;
        });
    }, []);
    const formCallback = useCallback(({ amount }, setFormState) => {
        generate(amount).then(
            () => setFormState(ofs => ({ ...ofs, disabled: false }))
        ).catch(e => {
            let errors = {};
            if ((e.response && e.response.data) && typeof e.response.data.d === "object")
                errors = e.response.data.d;
            setFormState(ofs => ({ ...ofs, errors: errors, disabled: false, error: http.getError(e) }));
        });
    }, [generate]);
    const generate1 = useCallback(() => generate(1), [generate]);
    const generate10 = useCallback(() => generate(10), [generate]);
    const generate100 = useCallback(() => generate(100), [generate]);

    const numValidator = useCallback(({ amount }) => {
        return new Promise((resolve, reject) => {
            if (!(NUMBER_RE).test(amount)) return reject({ amount: "A number is required" });
            resolve();
        });
    }, []);

    const toggleUnused = useCallback((unusedState) => {
        setOnlyUnused(unusedState);
    }, []);
    const setPerPage = useCallback((perPage) => {
        setLimit(perPage);
    }, []);

    return <>
        <Modal header={"Generated Invites:"} fullHeight={invites.length > 20} show={invites.length}
            key={invites[0]} cancel={false}>
            {invites.map(i => <React.Fragment key={i}><code>{i}</code><br /></React.Fragment>)}
        </Modal>

        <PageHead title={"Invites"} />
        <Container.Row>
            <Column lgWidth={6} mdWidth={12}>
                <Card lesser header={"Quick Generation"}>
                    <Container full centre toolbar>
                        <Button onClick={generate1} disabled={locked}>Generate 1 Invite</Button>
                        <Button onClick={generate10} disabled={locked}>Generate 10 Invites</Button>
                        <Button onClick={generate100} disabled={locked}>Generate 100 Invites</Button>
                    </Container>
                </Card>
                <Card lesser header={"Generate Invites"}>
                    <Form handle={formCallback} validator={numValidator} action={GENERATE_INVITES} locked={locked}>
                        <InputButton name={"amount"} format={NUMBER_RE} required
                            placeholder={"Number of invites"} button={"Generate"} />
                    </Form>
                </Card>
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                <Card lesser header={"Generate Single Invite"} >
                    <Form locked={locked}>
                        <Form.Group label={"Auto-join team ID"}>
                            <Input name={"team"} placeholder={"Auto-join team ID"} />
                        </Form.Group>
                        <Form.Group label={"Email"}>
                            <Input name={"email"} placeholder={"Email"} />
                        </Form.Group>
                        <Form.Group label={"Username"}>
                            <Input name={"username"} placeholder={"Username"} />
                        </Form.Group>
                        <Button submit>Generate</Button>
                    </Form>
                </Card>
            </Column>
            <Column lgWidth={12}>
                <Card lesser header={"View existing invites"}>
                    <Form>
                        <Form.Row>
                            <Checkbox onChange={toggleUnused} name={"Unused"}>Only show unused codes</Checkbox>
                            <SubtleText>Items per page:</SubtleText>
                            <Select onChange={setPerPage} mini options={[10, 100, 500, 1000]} initial={1} />
                        </Form.Row>
                    </Form>
                    <Grid headings={["Code", "Uses", "Team"]}
                        data={iState.data.map(i => [<code>{i.code}</code>, `${i.uses}/${i.max_uses}`, i.auto_team])} />
                    {iState.hasMore && (
                        <Container full toolbar centre>
                            <Button disabled={iState.loading} onClick={iNext}>
                                Load{iState.data.length ? " More" : ""}
                            </Button>
                        </Container>
                    )}
                </Card>
            </Column>
        </Container.Row>
    </>;
};
export default Invites;
