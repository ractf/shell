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

import React, { useState, useEffect, useRef, useCallback, useContext } from "react";

import { FlashText, Spinner, Button, Row, Modal, FormGroup, Form, Input } from "@ractf/ui-kit";
import { registerPlugin, useApi, appContext } from "ractf";
import http from "@ractf/http";
import { store } from "store";
import { NUMBER_RE } from "@ractf/util";

const ChallengeServer = ({ challenge }) => {
    const [state, setState] = useState({});
    const [instance_, error_, abort_] = useApi("/challengeserver/instance/" + challenge.challenge_metadata.cserv_name);

    useEffect(() => {
        setState({ instance: instance_, error: error_ });
    }, [instance_, error_]);

    const reset = () => {
        abort_();
        setState({ instance: null, error: null });
        http.get("/challengeserver/reset/" + challenge.challenge_metadata.cserv_name).then(data => {
            setState({ instance: data, error: null });
        }).catch(e => {
            setState({ instance: null, error: http.getError(e) });
        });
    };

    const button = (state.error || !state.instance) ? null : <Button large lesser onClick={reset}>
        Reset
    </Button>;

    return <Row>
        <FlashText danger={!!state.error} button={button}>
            {state.error ? <div>Failed to request instance: {state.error}</div>
                : state.instance ? <div>Challenge instance ready at <code>
                    {state.instance.ip}:{state.instance.port}
                </code>.</div> : <>
                        <div>Requesting challenge instance...</div>
                        <Spinner />
                    </>}
        </FlashText>
    </Row>;
};


const AddCSJob = ({ challenge, embedded }) => {
    const [isOpen, setOpen] = useState(false);
    const submitRef = useRef();
    const app = useContext(appContext);

    const submit = useCallback(() => {
        submitRef.current();
    }, []);
    const open = useCallback(() => {
        setOpen(true);
    }, []);
    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const handle = useCallback((data) => {
        http.post("/challengeserver/submit_job/", data).then(() => {
            app.alert("Added job!");
            setOpen(false);
        }).catch(e => {
            app.alert(`Failed to add job:\n${http.getError(e)}`);
        });
    }, [app]);
    const transformer = useCallback((data) => {
        return {
            ...data,
            job_spec: {
                ...data.job_spec,
                port: parseInt(data.job_spec.port, 10),
                replicas: parseInt(data.job_spec.replicas, 10),
                resources: {
                    ...data.job_spec.resources,
                    memory: parseInt(data.job_spec.resources.memory, 10),
                    cpus: parseFloat(data.job_spec.resources.cpus),
                }
            }
        };
    }, []);

    if (embedded) return null;

    return <>
        {isOpen && (
            <Modal header={"Add Job"} onClose={close} onConfirm={submit}>
                <Form submitRef={submitRef} handle={handle} transformer={transformer}>
                    <Input name={"challenge_id"} hidden val={challenge.id} />

                    <FormGroup label={"Name"}>
                        <Input name={"job_spec.name"} required />
                    </FormGroup>
                    <FormGroup label={"Port"}>
                        <Input name={"job_spec.port"} format={/\d+/} required />
                    </FormGroup>
                    <Row>
                        <FormGroup label={"Replicas"}>
                            <Input name={"job_spec.replicas"} val={5} format={/\d+/} required />
                        </FormGroup>
                        <FormGroup label={"Max Memory (Bytes)"}>
                            <Input name={"job_spec.resources.memory"} val={1073741824} format={/\d+/} required />
                        </FormGroup>
                        <FormGroup label={"CPUs"}>
                            <Input name={"job_spec.resources.cpus"} val={0.2} format={NUMBER_RE} required />
                        </FormGroup>
                    </Row>
                    <FormGroup label={"Image path"}>
                        <Input name={"job_spec.image"} required />
                    </FormGroup>
                    <Row>
                        <FormGroup label={"Registry Username"}>
                            <Input name={"job_spec.registryAuth.username"} />
                        </FormGroup>
                        <FormGroup label={"Registry Password"}>
                            <Input name={"job_spec.registryAuth.password"} password />
                        </FormGroup>
                    </Row>
                </Form>
            </Modal>
        )}
        <Row>
            <Button onClick={open} info style={{ width: "100%" }}>
                Add challenge server job
            </Button>
        </Row>
    </>;
};


export default () => {
    registerPlugin("challengeMetadata", "challengeServer", {
        fields: [
            {
                label: "Challenge server settings", type: "group", children: [
                    { name: "cserv_name", label: "Challenge server name", type: "text" },
                ]
            },
        ]
    });
    registerPlugin("challengeMod", "challengeServer", {
        component: ChallengeServer,
        check: (challenge) => !!challenge.challenge_metadata.cserv_name
    });
    registerPlugin("challengeMod", "challengeServerJobAdder", {
        component: AddCSJob,
        check: () => store.getState().user?.is_staff
    });
};
