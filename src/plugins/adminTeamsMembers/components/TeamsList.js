import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';

import {
    Form, Input, Button, Spinner, Modal, Row, FormGroup, InputButton,
    FormError, Leader, Checkbox, PageHead
} from "@ractf/ui-kit";
import { apiEndpoints, appContext, ENDPOINTS } from "ractf";


export default () => {
    const app = useContext(appContext);
    const endpoints = useContext(apiEndpoints);
    const { t } = useTranslation();

    const [state, setState] = useState({
        loading: false, error: null, results: null, team: null
    });
    const doSearch = ({ name }) => {
        setState(prevState => ({ ...prevState, results: null, error: null, loading: true }));

        endpoints.get(ENDPOINTS.TEAM + "?search=" + name).then(data => {
            setState(prevState => ({
                ...prevState, results: data.d.results, more: !!data.d.next, loading: false
            }));
        }).catch(e => {
            setState(prevState => ({ ...prevState, error: endpoints.getError(e), loading: false }));
        });
    };

    const editTeam = (team) => {
        return () => {
            setState(prevState => ({ ...prevState, loading: true }));
            endpoints.get(ENDPOINTS.TEAM + team.id).then(data => {
                setState(prevState => ({ ...prevState, loading: false, team: data.d }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, error: endpoints.getError(e), loading: false }));
            });
        };
    };
    const saveTeam = (team) => {
        return (changes) => {
            setState(prevState => ({ ...prevState, loading: true }));
            endpoints.modifyTeam(team.id, changes).then(() => {
                app.alert("Modified team");
                setState(prevState => ({ ...prevState, team: null, loading: false }));
            }).catch(e => {
                setState(prevState => ({ ...prevState, loading: false }));
                app.alert(endpoints.getError(e));
            });
        };
    };

    const close = () => {
        setState(prevState => ({ ...prevState, team: null }));
    };

    const makeOwner = (team, member) => {
        return () => {
            app.promptConfirm({
                message: `Make ${member.username} the owner of ${team.name}?`, small: true
            }).then(() => {
                endpoints.modifyTeam(team.id, { owner: member.id }).then(() => {
                    app.alert(`Transfered ownership to ${team.name}.`);
                    setState(prevState => {
                        if (!prevState.team) return prevState;
                        return { ...prevState, team: { ...prevState.team, owner: member.id } };
                    });
                }).catch(e => {
                    app.alert(endpoints.getError(e));
                });
            }).catch(() => { });
        };
    };

    return <>
        <PageHead title={t("admin.teams")} />
        <Form handle={doSearch} locked={state.loading}>
            <InputButton submit name={"name"} placeholder={"Search for Team"} button={"Search"} />
            {state.error && <FormError>{state.error}</FormError>}
        </Form>
        <br />
        {state.loading && <Row><Spinner /></Row>}
        {state.results && <Row>
            {state.results.length ? <>
                {state.more && <p>
                    Additional results were omitted. Please refine your search.
                </p>}
                    {state.results.map(i => <Leader click={editTeam(i)} key={i.id}>{i.name}</Leader>)}
            </> : <p>No results found</p>}
        </Row>}
        {state.team && <Modal onHide={close}>
            <Form handle={saveTeam(state.team)} locked={state.loading}>
                <FormGroup label={"Team Name"} htmlFor={"name"}>
                    <Input val={state.team.name} name={"name"} />
                </FormGroup>
                <FormGroup label={"Rights"}>
                    <Row left>
                        <Checkbox checked={state.team.is_visible} name={"is_active"}>Visible</Checkbox>
                    </Row>
                </FormGroup>
                <FormGroup label={"Password"} htmlFor={"password"}>
                    <Input val={state.team.password} name={"password"} />
                </FormGroup>
                <FormGroup label={"Owner ID"} htmlFor={"owner"}>
                    <Input val={state.team.owner} name={"owner"} format={/\d+/} />
                </FormGroup>
                <FormGroup label={"Members"}>
                    {state.team.members.map(i => {
                        let owner = i.id === state.team.owner;
                        return <Leader sub={owner ? "Owner" : ""} none={owner}
                            click={!owner ? makeOwner(state.team, i) : null}>
                            {i.username}
                        </Leader>;
                    })}
                </FormGroup>
                <Row>
                    <Button submit>Save</Button>
                </Row>
            </Form>
        </Modal>}
    </>;
};
