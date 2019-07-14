import React from "react";

import ListPage from "./bases/ListPage";


export default () => {
    return <ListPage
        title={"Teams"}
        columns={["Team", "Country", "Website", "Affiliation"]}
        data={[
            ["PWN to 0xE4", "UK", "https://pwn0xe4.io/", ""],
            ["Fuck Sai", "", "", ""],
        ]}
    />
}
