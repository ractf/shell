import React from "react";

import Table from "../../components/Table";
import Page from "./bases/Page";

export const TeamsList = () => {
    const data = [
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
        ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
        ["Who knows", "Murica", "", "SANS"],
    ]

    return <Page
        title={"Teams"}>
        <Table headings={["Team", "Country", "Website", "Affiliation"]} data={data} />
    </Page>;
}

export const UsersList = () => {
    const data = [
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
        ["Bottersnike", "https://bsnk.me", "PWN to 0xE4", ""],
        ["Not Bottersnike", "", "Other team", "SANS"],
    ]

    return <Page
        title={"Users"}>
        <Table headings={["User", "Website", "Team", "Affiliation"]} data={data} />
    </Page>;
}
