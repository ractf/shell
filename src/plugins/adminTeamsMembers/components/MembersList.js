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
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import {
    Form, Input, InputButton, Leader, Checkbox, PageHead, Modal, Button,
    ModalForm, ModalSpinner, UiKitModals, Hint
} from "@ractf/ui-kit";
import { ENDPOINTS, modifyUser, reloadAll } from "@ractf/api";
import * as http from "@ractf/util/http";
import { useExperiment } from "@ractf/shell-util";

import { setImpersonationToken } from "actions";


export default () => {
    const modals = useContext(UiKitModals);
    const submitRef = useRef();
    const { t } = useTranslation();
    const currentUser = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [state, setState] = useState({
        loading: false, error: null, results: null, member: null, advSearch: false
    });
    const doSearch = useCallback(({ username, email }, setFormState) => {
        setState(prevState => ({ ...prevState, results: null, error: null, advSearch: false, loading: true }));

        let params = "?";
        if (username) params += "search=" + username;
        if (email) params += "search=" + email;

        http.get(ENDPOINTS.USER + params, {}, { exporting: false }).then(data => {
            setState(prevState => ({
                ...prevState, results: data.results, more: !!data.next, loading: false
            }));
            setFormState(prevState => ({ ...prevState, disabled: false }));
        }).catch(e => {
            setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
            setFormState(prevState => ({ ...prevState, disabled: false }));
        });
    }, []);

    const editMember = (member) => {
        return () => {
            setState(prevState => ({ ...prevState, loading: true }));
            http.get(ENDPOINTS.USER + member.id).then(data => {
                setState(prevState => ({ ...prevState, loading: false, member: data }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
            });
        };
    };
    const saveMember = (member) => {
        return (changes) => {
            setState(prevState => ({ ...prevState, loading: true }));
            modifyUser(member.id, changes).then(() => {
                modals.alert("Modified user");
                setState(prevState => ({ ...prevState, member: null, loading: false }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, loading: false }));
                modals.alert(http.getError(e));
            });
        };
    };
    const impersonate = useCallback(() => {
        if (state.member.id === currentUser.id) {
            return modals.alert("You cannot impersonate yourself.");
        }
        modals.promptConfirm({
            small: true,
            message: <>
                You are about to impersonate a user.<br />
                This carries a number of risks with it - be <b>very</b> careful.<br />
                To return to your current account, logout as the impersonated user.<br /><br />
                Are you sure you wish to continue?
            </>
        }).catch().then(() => {
            http.post("/auth/sudo", { id: state.member.id }).then(({ token }) => {
                dispatch(setImpersonationToken(token));
                reloadAll();
            }).catch(e => {
                modals.alert(<>Failed to impersonate user:<br />{http.getError(e)}</>);
            });
        });
    }, [modals, currentUser.id, state.member, dispatch]);

    const close = useCallback(() => {
        setState(prevState => ({ ...prevState, member: null }));
    }, []);
    const submit = useCallback(() => {
        submitRef.current();
    }, []);

    const openAdvSearch = useCallback(() => {
        setState(prevState => ({ ...prevState, advSearch: true }));
    }, []);
    const closeAdvSearch = useCallback(() => {
        setState(prevState => ({ ...prevState, advSearch: false }));
    }, []);

    const [advSearch] = useExperiment("advSearch");

    return <>
        {state.advSearch && (
            <ModalForm header={"Advanced Member Search"} okay={"Search"}
                onClose={closeAdvSearch} handle={doSearch}>
                <Form.Group label={"Username"} for={"username"}>
                    <Input name={"username"} placeholder={"Username"} />
                </Form.Group>
                <Form.Group label={"Email"} for={"email"}>
                    <Input name={"email"} placeholder={"Email"} />
                </Form.Group>
            </ModalForm>
        )}

        <PageHead title={t("admin.members")} />
        {state.loading && <ModalSpinner />}
        <Form handle={doSearch} locked={state.loading}>
            <InputButton submit name={"username"} placeholder={"Search for Username"} button={"Search"} />
            {advSearch && <Button onClick={openAdvSearch}>Advanced Search</Button>}
            {state.error && <Form.Error>{state.error}</Form.Error>}
        </Form>
        {state.results && <>
            {state.results.length ? <>
                {state.more && <p>
                    Additional results were omitted. Please refine your search.
                </p>}
                {state.results.map(i => <Leader onClick={editMember(i)} key={i.id}>{i.username}</Leader>)}
            </> : <p>No results found</p>}
        </>}

        {state.member && <Modal onClose={close} onConfirm={submit} buttons={<>
            <Button lesser onClick={impersonate} warning>Impersonate user</Button>
        </>}>
            <Form handle={saveMember(state.member)} locked={state.loading} submitRef={submitRef}>
                <Form.Row>
                    <Form.Group label={"Username"} htmlFor={"username"}>
                        <Input val={state.member.username} name={"username"} />
                    </Form.Group>
                    <Form.Group label={"User ID"} htmlFor={"id"}>
                        <Input val={state.member.id} name={"id"} readonly />
                    </Form.Group>
                </Form.Row>
                <Form.Group label={"Rights"}>
                    <Form.Row>
                        <Checkbox val={state.member.is_active} name={"is_active"}>Active</Checkbox>
                        <Checkbox val={state.member.is_visible} name={"is_visible"}>Visible</Checkbox>
                        <Hint>
                            Admins have full control of the site, and can view user details
                        </Hint>
                        <Checkbox val={state.member.is_staff} name={"is_staff"}>Admin</Checkbox>
                        <Hint>
                            Staff is a visual indicator to players that a member is part of the event staff.
                            There are no additional permissions gained from this.
                        </Hint>
                        <Checkbox val={state.member.is_verified} name={"is_verified"}>Staff</Checkbox>
                    </Form.Row>
                </Form.Group>
                <Form.Group label={"Bio"} htmlFor={"bio"}>
                    <Input val={state.member.bio} name={"bio"} rows={2} />
                </Form.Group>
                <Form.Group label={"Discord"} htmlFor={"discord"}>
                    <Input val={state.member.discord} name={"discord"} />
                    <Input val={state.member.discordid} name={"discordid"} />
                </Form.Group>
                <Form.Group label={"Reddit"} htmlFor={"reddit"}>
                    <Input val={state.member.reddit} name={"reddit"} />
                </Form.Group>
                <Form.Group label={"Twitter"} htmlFor={"twitter"}>
                    <Input val={state.member.twitter} name={"twitter"} />
                </Form.Group>
                <Form.Group label={"Email"} htmlFor={"email"}>
                    <Input val={state.member.email} name={"email"} />
                    <Checkbox val={state.member.email_verified} name={"email_verified"}>
                        Email verified
                    </Checkbox>
                </Form.Group>
            </Form>
        </Modal>}
    </>;
};
