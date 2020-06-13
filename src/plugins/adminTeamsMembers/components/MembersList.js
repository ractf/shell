import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Button, Spinner, Modal, Row, FormGroup, InputButton,
    FormError, Leader, Checkbox, PageHead
} from "@ractf/ui-kit";
import { api, http, appContext } from "ractf";


export default () => {
    const app = useContext(appContext);
    const { t } = useTranslation();

    const [state, setState] = useState({
        loading: false, error: null, results: null, member: null
    });
    const doSearch = ({ name }) => {
        setState(prevState => ({ ...prevState, results: null, error: null, loading: true }));

        http.get(api.ENDPOINTS.USER + "?search=" + name).then(data => {
            setState(prevState => ({
                ...prevState, results: data.results, more: !!data.next, loading: false
            }));
        }).catch(e => {
            setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
        });
    };

    const editMember = (member) => {
        return () => {
            setState(prevState => ({ ...prevState, loading: true }));
            http.get(api.ENDPOINTS.USER + member.id).then(data => {
                setState(prevState => ({ ...prevState, loading: false, member: data }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, error: http.getError(e), loading: false }));
            });
        };
    };
    const saveMember = (member) => {
        return (changes) => {
            setState(prevState => ({ ...prevState, loading: true }));
            api.modifyUser(member.id, changes).then(() => {
                app.alert("Modified user");
                setState(prevState => ({ ...prevState, member: null, loading: false }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, loading: false }));
                app.alert(http.getError(e));
            });
        };
    };

    const close = () => {
        setState(prevState => ({ ...prevState, member: null }));
    };

    return <>
        <PageHead title={t("admin.members")} />
        <Form handle={doSearch} locked={state.loading}>
            <InputButton submit name={"name"} placeholder={"Search for Username"} button={"Search"} />
            {state.error && <FormError>{state.error}</FormError>}
        </Form>
        <br />
        {state.loading && <Row><Spinner /></Row>}
        {state.results && <Row>
            {state.results.length ? <>
                {state.more && <p>
                    Additional results were omitted. Please refine your search.
                </p>}
                    {state.results.map(i => <Leader onClick={editMember(i)} key={i.id}>{i.username}</Leader>)}
            </> : <p>No results found</p>}
        </Row>}
        {state.member && <Modal onHide={close}>
            <Form handle={saveMember(state.member)} locked={state.loading}>
                <FormGroup label={"Username"} htmlFor={"username"}>
                    <Input val={state.member.username} name={"username"} />
                </FormGroup>
                <FormGroup label={"Rights"}>
                    <Row left>
                        <Checkbox val={state.member.is_active} name={"is_active"}>Active</Checkbox>
                        <Checkbox val={state.member.is_staff} name={"is_staff"}>Staff</Checkbox>
                        <Checkbox val={state.member.is_visible} name={"is_visible"}>Visible</Checkbox>
                    </Row>
                </FormGroup>
                <FormGroup label={"Bio"} htmlFor={"bio"}>
                    <Input val={state.member.bio} name={"bio"} rows={2} />
                </FormGroup>
                <FormGroup label={"Discord"} htmlFor={"discord"}>
                    <Input val={state.member.discord} name={"discord"} />
                    <Input val={state.member.discordid} name={"discordid"} />
                </FormGroup>
                <FormGroup label={"Reddit"} htmlFor={"reddit"}>
                    <Input val={state.member.reddit} name={"reddit"} />
                </FormGroup>
                <FormGroup label={"Twitter"} htmlFor={"twitter"}>
                    <Input val={state.member.twitter} name={"twitter"} />
                </FormGroup>
                <FormGroup label={"Email"} htmlFor={"email"}>
                    <Input val={state.member.email} name={"email"} />
                    <Checkbox val={state.member.email_verified} name={"email_verified"}>
                        Email verified
                    </Checkbox>
                </FormGroup>
                <Row>
                    <Button submit>Save</Button>
                </Row>
            </Form>
        </Modal>}
    </>;
};
