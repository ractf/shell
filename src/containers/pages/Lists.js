import React from "react";

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import { Table, Spinner, FormError, useApi } from "ractf";


export const TeamsList = () => {
    const [allTeams, error] = useApi("/teams/list");

    return <Page
        title={"Teams"} vCentre={error || !allTeams}>
        {error ? <>
            <FormError>
                Something went wrong trying to get the teams list<br />
                Please try reloading the page
            </FormError>
            <BrokenShards />
        </> :
            allTeams ?
                <Table headings={["Team"]} data={allTeams.map(x => [x.name, "/team/" + x.id])} />
                : <Spinner />
        }
    </Page>;
};


export const UsersList = () => {
    const [allUsers, error] = useApi("/members/list");

    return <Page
        title={"Users"} vCentre={error || !allUsers}>
        {error ? <>
            <FormError>
                Something went wrong trying to get the user list<br />
                Please try reloading the page
            </FormError>
            <BrokenShards />
        </> :
            allUsers ?
                <Table headings={["Name", "Team"]}
                    data={allUsers.map(x => [x.name, x.team_name, "/profile/" + x.id])} />
                : <Spinner />
        }
    </Page>;
};
