import React from "react";

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import { Table, Spinner, FormError, useApi, SectionTitle2 } from "ractf";


export const TeamsList = () => {
    const [allTeams, error] = useApi("/teams/list");

    return <Page
        title={"Teams"} vCentre={error || !allTeams}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>All Teams</SectionTitle2>
            <br />
        </div>
        {error ? <>
            <FormError>
                Something went wrong trying to get the teams list<br />
                Please try reloading the page
            </FormError>
            <BrokenShards />
        </> :
            allTeams ?
                <Table headings={["Team", "Website", "Members"]} data={
                    allTeams.map(x => [x.name, x.website, x.members, "/team/" + x.id])
                } /> : <Spinner />
        }
    </Page>;
};


export const UsersList = () => {
    const [allUsers, error] = useApi("/members/list");

    return <Page
        title={"Users"} vCentre={error || !allUsers}>
        <div style={{ textAlign: "center" }}>
            <SectionTitle2>All Users</SectionTitle2>
            <br />
        </div>
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
