import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, Spinner, Modal, FlexRow, FormGroup, InputButton,
    FormError, Leader, Checkbox, SBTSection
} from "@ractf/ui-kit";
import { apiEndpoints, appContext, ENDPOINTS } from "ractf";


export default () => {
    const app = useContext(appContext);
    const endpoints = useContext(apiEndpoints);
    const { t } = useTranslation();

    const [state, setState] = useState({
        loading: false, error: null, results: null, member: null
    });
    const doSearch = ({ name }) => {
        setState(prevState => ({ ...prevState, results: null, error: null, loading: true }));

        endpoints.get(ENDPOINTS.USER + "?search=" + name).then(data => {
            setState(prevState => ({
                ...prevState, results: data.d.results, more: !!data.d.next, loading: false
            }));
        }).catch(e => {
            setState(prevState => ({ ...prevState, error: endpoints.getError(e), loading: false }));
        });
    };

    const editMember = (member) => {
        return () => {
            setState(prevState => ({ ...prevState, loading: true }));
            endpoints.get(ENDPOINTS.USER + member.id).then(data => {
                setState(prevState => ({ ...prevState, loading: false, member: data.d }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, error: endpoints.getError(e), loading: false }));
            });
        };
    };
    const saveMember = (member) => {
        return (changes) => {
            setState(prevState => ({ ...prevState, loading: true }));
            endpoints.modifyUser(member.id, changes).then(() => {
                app.alert("Modified user");
                setState(prevState => ({ ...prevState, member: null, loading: false }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, loading: false }));
                app.alert(endpoints.getError(e));
            });
        };
    };

    const close = () => {
        setState(prevState => ({ ...prevState, member: null }));
    };

    return <SBTSection title={t("admin.members")}>
        <Form handle={doSearch} locked={state.loading}>
            <InputButton submit name={"name"} placeholder={"Search for Username"} button={"Search"} />
            {state.error && <FormError>{state.error}</FormError>}
        </Form>
        {state.loading && <Spinner />}
        {state.results && <>
            <br />
            {state.results.length ? <>
                {state.more && <><FlexRow>
                    Additional results were omitted. Please refine your search.
                </FlexRow><br /></>}
                {state.results.map(i => <Leader click={editMember(i)} key={i.id}>{i.username}</Leader>)}
            </> : <FlexRow><br />
                No results found
            </FlexRow>}
        </>}
        {state.member && <Modal onHide={close}>
            <Form handle={saveMember(state.member)} locked={state.loading}>
                <FormGroup label={"Username"} htmlFor={"username"}>
                    <Input val={state.member.username} name={"username"} />
                </FormGroup>
                <FormGroup label={"Rights"}>
                    <FlexRow left>
                        <Checkbox checked={state.member.is_active} name={"is_active"}>Active</Checkbox>
                        <Checkbox checked={state.member.is_staff} name={"is_staff"}>Staff</Checkbox>
                        <Checkbox checked={state.member.is_visible} name={"is_visible"}>Visible</Checkbox>
                    </FlexRow>
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
                    <Checkbox checked={state.member.email_verified} name={"email_verified"}>
                        Email verified
                    </Checkbox>
                </FormGroup>
                <FlexRow>
                    <Button submit>Save</Button>
                </FlexRow>
            </Form>
        </Modal>}
    </SBTSection>;
};
