import React from "react";

import Button from "../../components/Button";
import HubButton from "../../components/HubButton";
import { HR, SectionTitle, SectionSub, CTFContainer } from "../../components/Misc";

import { APIContext } from "../controllers/API";

function generateLinks(categories) {
    let links = [];
    categories.map((category) =>
        links.push(<HubButton key={ category[1] } to={"/category/" + category[1]}>{ category[0] }</HubButton>)
    );
    return links;
}

export default () => <>
    <CTFContainer>
        <APIContext.Consumer>{api => <>
            <SectionTitle>Welcome, {api.user.username}</SectionTitle>
            <SectionSub>This is your mission hub</SectionSub>

            { generateLinks(api.categories) }

            <HR />
            <Button to={"/home"}>Back</Button>
        </>}</APIContext.Consumer>
    </CTFContainer>
</>
