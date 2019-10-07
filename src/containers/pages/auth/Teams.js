import React, { useState, createRef } from "react";
import { Link } from "react-router-dom";

import { Form, Page, SectionTitle2, Input, Button, ButtonRow, SubtleText, formAction } from "ractf";
import { Wrap, FormError } from "./Parts";


export const JoinTeam = () => {
    const [message, setMessage] = useState("");
    const button = createRef();
    const submit = formAction();

    const doJoinTeam = ({ name, password }) => {

    }

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>Join a Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/new"}>create a team</Link> instead?
            </SubtleText>

            <Form submit={submit} handle={doJoinTeam} button={button}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Join Team</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
}


export const CreateTeam = () => {
    const [message, setMessage] = useState("");
    const button = createRef();
    const submit = formAction();

    const doCreateTeam = ({ name, affil, web, password }) => {

    }

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>Create a New Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/join"}>join a team</Link> instead?
            </SubtleText>

            <Form submit={submit} handle={doCreateTeam} button={button}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"affil"} placeholder={"Affiliation"} />
                <Input name={"web"} placeholder={"Website"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button ref={button} form={submit} medium>Create Team</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
}
