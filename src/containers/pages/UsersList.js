import React from "react";

import ListPage from "./bases/ListPage";


export default () => {
    return <ListPage
        title={"Users"}
        columns={["User", "Country", "Team"]}
        data={[
            ["Bottersnike", "UK", "PWN to 0xE4"],
            ["Shana", "UK", ""],
            ["Strike Bottle", "US", "Fuck Sai"],
        ]}
    />
}
