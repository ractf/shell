import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";

import { apiContext, Form, FormError, Page, SectionTitle2, HR, Input, Button, ButtonRow, SubtleText } from "ractf";
import { Wrap } from "./Parts";


export const JoinTeam = () => {
    const api = useContext(apiContext);

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);

    if (api.team !== null)
        return <Redirect to={"/"} />;

    const doJoinTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage("Team name missing");

        setLocked(true);
        api.joinTeam(name, password).then(resp => {
            setSuccess(true);
        }).catch(e => {
            setMessage(api.getError(e));
            setLocked(false);
        })
    }

    return <Page vCentre>
        <Wrap>{success ?
            <>
                <SectionTitle2>Team Joined!</SectionTitle2>
                <HR />
                <div>Where now?</div>

                <ButtonRow>
                    <Button medium to={"/campaign"}>Challenges</Button>
                    <Button medium lesser to={"/settings"}>Settings</Button>
                </ButtonRow>
            </> : <>
                <SectionTitle2>Join a Team</SectionTitle2>
                <SubtleText>
                    Did you want to <Link to={"/team/new"}>create a team</Link> instead?
                </SubtleText>
                <br />

                <Form locked={locked} handle={doJoinTeam}>
                    <Input name={"name"} placeholder={"Team Name"} />
                    <Input name={"password"} placeholder={"Team Password"} password />

                    {message && <FormError>{message}</FormError>}

                    <Button medium submit>Join Team</Button>
                </Form>
            </>}

        </Wrap>
    </Page>;
}


export const CreateTeam = () => {
    const api = useContext(apiContext);

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);

    if (api.team !== null)
        return <Redirect to={"/"} />;

    const doCreateTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage("Team name missing");
        if (password.length < 8)
            return setMessage("Password too short");

        setLocked(true);
        api.createTeam(name, password).then(resp => {
            setSuccess(true);
        }).catch(e => {
            setMessage(api.getError(e));
            setLocked(false);
        })
    }

    return <Page vCentre>
        <Wrap>{success ?
            <>
                <SectionTitle2>Team created!</SectionTitle2>
                <HR />
                <div>Where now?</div>

                <ButtonRow>
                    <Button medium to={"/campaign"}>Challenges</Button>
                    <Button medium lesser to={"/settings"}>Settings</Button>
                </ButtonRow>
            </> : <>
                <SectionTitle2>Create a Team</SectionTitle2>
                <SubtleText>
                    Did you want to <Link to={"/team/join"}>join a team</Link> instead?
                    </SubtleText>
                <br />

                <Form locked={locked} handle={doCreateTeam}>
                    <Input name={"name"} placeholder={"Team Name"} />
                    {/*<Input name={"affil"} placeholder={"Affiliation"} />
                    <Input name={"web"} placeholder={"Website"} />*/}
                    <Input name={"password"} placeholder={"Team Password"} password />

                    {message && <FormError>{message}</FormError>}

                    <Button medium submit>Create Team</Button>
                </Form>
            </>}
        </Wrap>
    </Page>;
}
