import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import { Page, SectionTitle2, Button, ButtonRow, apiContext } from "ractf";
import { Wrap } from "./Parts";


export default () => {
    const api = useContext(apiContext);
    if (api.team) return <Redirect to={"/team"}/>;

    return <Page vCentre>
        <Wrap>
            <SectionTitle2>
                Welcome to RACTF!
            </SectionTitle2>
            <br />
            <div>Where to now, chief?</div>
            <ButtonRow>
                <Button to={"/team/new"}>Create a Team</Button>
                <Button to={"/team/join"}>Join a Team</Button>
            </ButtonRow>
        </Wrap>
    </Page>;
}
