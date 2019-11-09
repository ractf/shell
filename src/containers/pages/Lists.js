import React, { useEffect, useContext, useState } from "react";

import { BrokenShards } from "./ErrorPages";
import Page from "./bases/Page";

import { Table, Spinner, FormError, apiContext } from "ractf";


export const TeamsList = () => {
    const api = useContext(apiContext);
    const [error, setError] = useState("");

    useEffect(() => {
        api.ensure("allTeams").catch(e => {
            setError("Something went wrong trying to get the user list\nPlease try reloading the page")
        });
    }, [api]);

    return <Page
        title={"Teams"} vCentre={error || !api.allTeams}>
        {error ? <>
            <FormError>{error}</FormError>
            <BrokenShards />
        </> :
            api.allTeams ?
                <Table headings={["Team"]} data={api.allTeams.map(x => [x.name])} />
                : <Spinner />
        }
    </Page>;
}


export const UsersList = () => {
    const api = useContext(apiContext);
    const [error, setError] = useState("");

    useEffect(() => {
        api.ensure("allUsers").catch(e => {
            setError("Something went wrong trying to get the user list\nPlease try reloading the page")
        });
    }, [api]);

    return <Page
        title={"Users"} vCentre={error || !api.allUsers}>
        {error ? <>
            <FormError>{error}</FormError>
            <BrokenShards />
        </> :
            api.allUsers ?
                <Table headings={["Team"]} data={api.allUsers.map(x => [x.name, x.team])} />
                : <Spinner />
        }
    </Page>;
}
