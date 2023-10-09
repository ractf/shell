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

import React, { useContext, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, InputButton, Leader,
    Checkbox, PageHead, Modal, Card, ModalSpinner, UiKitModals
} from "@ractf/ui-kit";
import { ENDPOINTS, modifyTeam } from "@ractf/api";
import { NUMBER_RE } from "@ractf/util";
import * as http from "@ractf/util/http";
import { useConfig } from "@ractf/shell-util";


export default () => {
    const modals = useContext(UiKitModals);
    const submitRef = useRef();
    const { t } = useTranslation();
    const hasTeams = useConfig("enable_teams");

    const [state, setState] = useState({
        loading: false, error: null, results: null, team: null
    });
    const doSearch = useCallback(({ name }, setFormState) => {
        setState(prevState => ({ ...prevState, results: null, error: null, loading: true }));

        http.get(ENDPOINTS.TEAM + "?search=" + name).then(data => {
            setState(prevState => ({
                ...prevState, results: data.results, more: !!data.next, loading: false
            }));
            setFormState(prevState => ({ ...prevState, disabled: false }));
        }).catch(e => {
            setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
            setFormState(prevState => ({ ...prevState, disabled: false }));
        });
    }, []);

    const editTeam = (team) => {
        return () => {
            setState(prevState => ({ ...prevState, loading: true }));
            http.get(ENDPOINTS.TEAM + team.id).then(data => {
                setState(prevState => ({ ...prevState, loading: false, team: data }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
            });
        };
    };
    const saveTeam = (team) => {
        return (changes) => {
            setState(prevState => ({ ...prevState, loading: true }));
            modifyTeam(team.id, changes).then(() => {
                modals.alert("Modified team");
                setState(prevState => ({ ...prevState, team: null, loading: false }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, loading: false }));
                modals.alert(http.getError(e));
            });
        };
    };

    const close = () => {
        setState(prevState => ({ ...prevState, team: null }));
    };

    const makeOwner = (team, member) => {
        return () => {
            modals.promptConfirm({
                message: `Make ${member.username} the owner of ${team.name}?`, small: true
            }).then(() => {
                modifyTeam(team.id, { owner: member.id }).then(() => {
                    modals.alert(`Transfered ownership to ${team.name}.`);
                    setState(prevState => {
                        if (!prevState.team) return prevState;
                        return { ...prevState, team: { ...prevState.team, owner: member.id } };
                    });
                }).catch(e => {
                    modals.alert(http.getError(e));
                });
            }).catch(() => { });
        };
    };
    const submit = useCallback(() => {
        submitRef.current();
    }, []);

    if (!hasTeams) {
        return <Card slim danger>Teams are not enabled for this event.</Card>;
    }

    return <>
        <PageHead title={t("admin.teams")} />
        {state.loading && <ModalSpinner />}
        <Form handle={doSearch} locked={state.loading}>
            <InputButton submit name={"name"} placeholder={"Search for Team"} button={"Search"} />
            {state.error && <Form.Error>{state.error}</Form.Error>}
        </Form>
        {state.results && <>
            {state.results.length ? <>
                {state.more && <p>
                    Additional results were omitted. Please refine your search.
            </p>}
                {state.results.map(i => <Leader onClick={editTeam(i)} key={i.id}>{i.name}</Leader>)}
            </> : <p>No results found</p>}
        </>}

        {state.team && <Modal onClose={close} onConfirm={submit}>
            <Form handle={saveTeam(state.team)} locked={state.loading} submitRef={submitRef}>
                <Form.Row>
                    <Form.Group label={"Team Name"} htmlFor={"name"}>
                        <Input val={state.team.name} name={"name"} />
                    </Form.Group>
                    <Form.Group label={"Team ID"} htmlFor={"id"}>
                        <Input val={state.team.id} name={"id"} readonly />
                    </Form.Group>
                </Form.Row>
                <Form.Group label={"Rights"}>
                    <Checkbox val={state.team.is_visible} name={"is_visible"}>Visible</Checkbox>
                </Form.Group>
                <Form.Group label={"Password"} htmlFor={"password"}>
                    <Input val={state.team.password} name={"password"} />
                </Form.Group>
                <Form.Group label={"Owner ID"} htmlFor={"owner"}>
                    <Input val={state.team.owner} name={"owner"} format={NUMBER_RE} />
                </Form.Group>
                <Form.Group label={"Leaderboard Group ID"} htmlFor={"leaderboard_group"}>
                    <Input val={state.team.leaderboard_group} name={"leaderboard_group"} format={NUMBER_RE} />
                </Form.Group>
                <Form.Group label={"Members"}>
                    {state.team.members.map(i => {
                        const owner = i.id === state.team.owner;
                        return <Leader sub={owner ? "Owner" : ""} none={owner}
                            onClick={!owner ? makeOwner(state.team, i) : null}>
                            {i.username}
                        </Leader>;
                    })}
                </Form.Group>
            </Form>
        </Modal>}
    </>;
};
