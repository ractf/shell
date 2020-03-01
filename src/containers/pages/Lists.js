import React from "react";

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import { Table, FormError, SectionTitle2, usePaginated, Button, ENDPOINTS } from "ractf";


export const TeamsList = () => {
    const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.TEAM);

    return <Page
        title={"Teams"} vCentre={error}>
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
        </> : <>
            <Table headings={["Team", "Website", "Members"]} data={
                results.map(x => [x.name, x.website, x.members.length, "/team/" + x.id])
            } />
            {hasMore && <Button disabled={loading} click={next}>Load More</Button>}
        </>}
    </Page>;
};


export const UsersList = () => {
    const [{results, hasMore}, next, loading, error] = usePaginated(ENDPOINTS.USER);

    return <Page
        title={"Users"} vCentre={error}>
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
        </> : <>
            <Table headings={["Name", "Team"]} data={
                results.map(x => [x.username, x.team_name, "/profile/" + x.id])
            } />
            {hasMore && <Button disabled={loading} click={next}>Load More</Button>}
        </>}
    </Page>;
};
