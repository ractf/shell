import React from "react";
import styled from "styled-components";

import Button, { ButtonRow } from "../../components/Button";
import Input from "../../components/Input";
import ToggleButton from "../../components/ToggleButton";
import { HR, SectionTitle, CTFContainer } from "../../components/Misc";

import TabbedView from "../../components/TabbedView";

import { APIContext } from "../controllers/Contexts";

const OptionTitle = styled.div`
    font-size: 1.3em;
    text-align: left;
    margin: .3em 8px;
`;

export default () => <>
    <CTFContainer>
        <APIContext.Consumer>{api => <>
            <SectionTitle>Settings for {api.user.username}</SectionTitle><br />
            <TabbedView>
                <div label="Site">
                    <ButtonRow>
                        <ToggleButton options={[["Enabled", "yes"], ["Disabled", "no"]]} default={1}>Site Audio:</ToggleButton>
                        <ToggleButton options={[["Enabled", "yes"], ["Disabled", "no"]]} default={0}>Particles.js:</ToggleButton>
                    </ButtonRow>
                    <Button medium>Randomize Audio</Button>
                </div>
                <div label="User">
                    <OptionTitle>Username</OptionTitle>
                    <Input val={api.user.username} limit={36} placeholder={"Username"} />
                    <OptionTitle>Team Code</OptionTitle>
                    <Input val={api.user.username} password placeholder={"Team Code"} />
                </div>
                <div label="Team">
                    <OptionTitle>Team Name</OptionTitle>
                    <Input val={api.user.username} limit={36} placeholder={"Team Name"} />
                    <OptionTitle>Team Description</OptionTitle>
                    <Input val={api.user.username} rows={5} placeholder={"Team Description"} />
                    <OptionTitle>Team password</OptionTitle>
                    <Input val={api.user.username} password placeholder={"Team Password"} />
                </div>
            </TabbedView>
            <HR />
            <Button to={"/home"}>Back</Button>
        </>}</APIContext.Consumer>
    </CTFContainer>
</>
