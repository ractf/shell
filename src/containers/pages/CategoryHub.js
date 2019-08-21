import React, {useContext} from "react";
import { Redirect } from "react-router-dom";

import Button from "../../components/Button";
import HubButton from "../../components/HubButton";
import { HR, SectionTitle, SectionSub, CTFContainer } from "../../components/Misc";

import { APIContext } from "../controllers/API";

function generateLinks(cat, challenges) {
    let links = [];
    challenges.map((chal) =>
        links.push(<HubButton
            key={chal.number}
            to={"/category/" + cat + "/" + chal.number}>{ chal.name }</HubButton>)
    );
    return links;
}

export default ({ match }) => {
    const api = useContext(APIContext);

    const catName = api.getCategoryName(match.params.category);
    const challenges = api.challengesIn(match.params.category);

    if (!catName) return <Redirect to={"/hub"}/>;

    return <CTFContainer>
        <SectionTitle>{ catName }</SectionTitle>
        <SectionSub>Here are the challenges for { catName }</SectionSub>

        {challenges.length ? generateLinks(match.params.category, challenges)
            : <><br />No challenges in this category</> }

        <HR />
        <Button to={"/hub"}>Back</Button>
    </CTFContainer>;
}
