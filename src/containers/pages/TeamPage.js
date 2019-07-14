import React from "react";

import OverviewPage from "./bases/OverviewPage";

export default () => {
    return (
        <OverviewPage
            title={"PWN to 0xE4"}
            website={"https://pwn0xe4.io/"}
            underTitle={"69th Place"}
            description={"Big up, cyber discovery ::))"}

            sections={[
                ["Members",
                ["Name", "Points"],
                [["Bottersnike", "6969"], ["Ben", "0"]]
            ],
                ["Solves",
                ["Challenge", "Points", "Solver", "Time"],
                [["Piss Off", "6968", "Bottersnike", "??"],
                 ["No", "1", "Bottersnike", ""]]
            ]]}
        />
    )
}
