import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Form, FormError, Page, SectionTitle2, Input, Button, ButtonRow, SubtleText } from "ractf";
import { Wrap } from "./Parts";


export const JoinTeam = () => {
    const [message, setMessage] = useState("");

    const doJoinTeam = ({ name, password }) => {

    }

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>Join a Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/new"}>create a team</Link> instead?
            </SubtleText>

            <Form handle={doJoinTeam}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button medium submit>Join Team</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
}


export const CreateTeam = () => {
    const [message, setMessage] = useState("");

    const doCreateTeam = ({ name, affil, web, password }) => {

    }

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>Create a New Team</SectionTitle2>
            <SubtleText>
                Did you want to <Link to={"/team/join"}>join a team</Link> instead?
            </SubtleText>

            <Form handle={doCreateTeam}>
                <Input name={"name"} placeholder={"Team Name"} />
                <Input name={"affil"} placeholder={"Affiliation"} />
                <Input name={"web"} placeholder={"Website"} />
                <Input name={"password"} placeholder={"Team Password"} password />

                {message && <FormError>{message}</FormError>}

                <ButtonRow>
                    <Button medium submit>Create Team</Button>
                </ButtonRow>
            </Form>
        </Wrap>
    </Page>;
}
