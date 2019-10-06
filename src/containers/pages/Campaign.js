import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import { SectionBlurb } from "../../components/Misc";
import { APIContext } from "../controllers/Contexts";
import TabbedView from "../../components/TabbedView";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins } from "ractf";


const TabWrap = styled.div`
    margin: auto;
    padding-top: 1rem;
    padding-bottom: 4rem;
`;


export default () => {
    const [challenge, setChallenge] = useState(null);

    const showChallenge = (challenge) => {
        return () => {
            setChallenge(challenge);
        }
    }

    let challengeTabs = [];
    const api = useContext(APIContext);

    if (!api.challenges)
        return <Redirect to={"/login"} />;

    let blurb, handler;
    api.challenges.forEach((tab, n) => {
        blurb = <SectionBlurb>{tab.desc}</SectionBlurb>

        handler = plugins.categoryType[tab.type];
        challengeTabs.push(
            <div label={tab.title} key={n}>
                <TabWrap>
                    { handler ? <>
                        { blurb }
                        { handler.generator(tab, showChallenge) }
                    </> : <>
                        Category renderer for type "{ tab.type }" missing!<br/><br/>
                        Did you forget to install a plugin?
                    </>}
                </TabWrap>
            </div>
        );
    })

    let chalEl;
    const hideChal = (() => setChallenge(null));
    if (challenge) {
        if (challenge.type)
            handler = plugins.challengeType[challenge.type];
        else
            handler = plugins.challengeType["__default"];

        if (!handler)
            chalEl = <>
                Challenge renderer for type "{ challenge.type }" missing!<br/><br/>
                Did you forget to install a plugin?
            </>;
        else chalEl = handler.generator(challenge, hideChal);
        
        chalEl = <Modal onHide={hideChal}>
            { chalEl }
        </Modal>;
    }

    return <Page title={"Challenges"}>
        { chalEl }
        <TabbedView center>
            { challengeTabs }
        </TabbedView>
    </Page>;
};
