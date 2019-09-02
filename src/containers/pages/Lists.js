import React from "react";
import Table from "../../components/Table";
import TabbedView from "../../components/TabbedView";

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

export const Leaderboard = () => {
    const userData = [
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
        ["1st","Nick","https://nicholasg.me","StantonSquad","Safeguarding", "10,000,000"],
    ]

    const teamData = [
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
        ["1st","StantonSquad","UK","https://nicholasg.me","Safeguarding", "10,000,000"],
    ]

    return <Page title={"Leaderboard"}>
        <TabbedView center>
            <div label='Users'>
                <Table headings={["Ranking", "User", "Website", "Team", "Affiliation", "Points"]} data={userData} />
            </div>

            <div label='Teams'>
                <Table headings={["Ranking", "Team", "Country", "Website", "Affiliation", "Points"]} data={teamData} />
            </div>
        </TabbedView>
    </Page>;

}