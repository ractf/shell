import React, { useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import useReactRouter from "../../useReactRouter";
import Page from "./bases/Page";

import { plugins, apiContext, SBTSection } from "ractf";


export default () => {
    const { match } = useReactRouter();
    const tabId = match.params.tabId;
    const chalId = match.params.chalId;

    const api = useContext(apiContext);

    let tab = (() => {
        for (let i in api.challenges) {
            if (api.challenges[i].id === tabId) return api.challenges[i];
        }
    })();
    let challenge = (() => {
        if (!tab) return null;
        for (let i in tab.chals)
            if (tab.chals[i].id === chalId) return tab.chals[i];
    })();
    let chalEl, handler;

    if (!tab) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />
    }

    handler = plugins.categoryType[tab.type];
    if (challenge) {
        if (challenge.type)
            handler = plugins.challengeType[challenge.type];
        else
            handler = plugins.challengeType["__default"];

        if (!handler)
            chalEl = <>
                Challenge renderer for type "{challenge.type}" missing!<br /><br />
                Did you forget to install a plugin?
            </>;
        else {
            chalEl = React.createElement(
                handler.component, {
                challenge: challenge,
            });
        }
    }

    let solveMsg = challenge.first ? "First solved by " + challenge.first : "Nobody has solved this challenge yet";

    return <Page title={challenge ? challenge.name : "Challenges"}>
        <SBTSection key={tab.id} subTitle={challenge.base_score + " points - " + solveMsg} title={challenge.name}>
            <Link to={".."}>&lt; Back to challenges</Link>
            {chalEl}
        </SBTSection>
    </Page>;
}