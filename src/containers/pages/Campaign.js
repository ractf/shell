import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { transparentize } from "polished";
import { MdKeyboardArrowLeft } from "react-icons/md";
import styled from "styled-components";

import { SectionBlurb } from "../../components/Misc";
import { APIContext } from "../controllers/Contexts";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import { plugins, Button } from "ractf";
import theme from "theme";


const EditButton = styled(Button)`
    position: absolute;
    top: 8px;
    right: 32px;
`;

const SBWrapWrap = styled.div`
    position: relative;
`;
const SBWrap = styled.div`
    position: relative;
    height: 100%;

    @media (max-width: 600px) {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 30;
    }
`;
const SBBurger = styled.div`
    position: absolute;
    left: 100%;
    top: 8px;
    width: 36px;
    height: 36px;
    background-color: ${theme.bg_d0};
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    z-index: 2;

    &>* {
        width: 24px;
        height: 24px;
        position: absolute;
        left: 6px;
        top: 6px;
        transition: transform 200ms ease;
        transform: rotateY(${props => props.sbHidden ? "180deg" : "0"});
    }

    @media (max-width: 600px) {
        width: 48px;
        height: 48px;
        
        &>* {
            width: 38px;
            height: 38px;
            left: 6px;
            top: 6px;
        }
    }
`;
const Sidebar = styled.div`
    background-color: ${theme.bg_d0};
    flex-shrink: 0;
    width: 250px;
    margin-left: ${props => props.sbHidden ? "-250px" : "0"};
    box-shadow: 0 0 2px #0005;
    transition: margin-left 200ms ease;
    text-align: left;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;

    &>* {
        flex-shrink: 0;
    }

    &>*:not(.head) {
        padding: 8px 24px;
        border-bottom: 1px solid ${theme.bg_l1};
        transition: padding 100ms ease, background-color 100ms ease;
        cursor: pointer;
    }
    &>*:not(.head):not(.active):hover {
        padding-left: 32px;
        background-color: ${theme.bg_d1}
    }
    &>*.active {
        padding-left: 32px;
        background-color: ${theme.bg_d05}
    }
    &>*.head {
        padding: 12px 16px;
        border-bottom: 2px solid ${theme.bg_l2};
        font-weight: 500;
    }
`;

const ChallengeBody = styled.div`
    text-align: center;
    width: 100%;
    position: relative;
    padding: 24px 64px;
    @media (max-width: 600px) {
        padding: 24px 16px;
    }
`;


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [lState, setLState] = useState({});

    const [activeTab, setActiveTab] = useState(0);
    const [sbHidden, setSbHidden] = useState(false);
    //const app = useContext(appContext);

    const showChallenge = (challenge) => {
        return () => {
            //app.setModalOpen(true);
            setChallenge(challenge);
            setIsEditor(false);
        }
    }

    const showEditor = (challenge, saveTo) => {
        return () => {
            console.log('!!', saveTo);

            setChallenge(challenge || {});
            setLState({
                saveTo: saveTo
            })
            setIsEditor(true);
        }
    }

    const hideChal = () => {
        setChallenge(null);
        setIsEditor(false);
    };

    const saveEdit = (original) => {
        return changes => {
            console.log(changes);
            for (let i in changes) {
                original[i] = changes[i];
            }

            if (lState.saveTo) {
                lState.saveTo.push(original);
            }

            setIsEditor(false);
            setChallenge(null);
        }
    }

    const api = useContext(APIContext);

    if (!api.challenges)
        api.challenges = [];

    let handler;
    let challengeTabs = api.challenges.map((tab, n) => {
        handler = plugins.categoryType[tab.type];
        return <div key={n} style={{display: n === activeTab ? "block" : "none"}}>
            { edit ? 
                <EditButton click={() => {setEdit(false)}} warning>Stop Editing</EditButton>
                : <EditButton click={() => {setEdit(true)}} warning>Edit</EditButton>}

            { handler ? <>
                <SectionBlurb>{tab.desc}</SectionBlurb>
                { handler.generator(tab, showChallenge, showEditor, edit) }
            </> : <>
                Category renderer for type "{ tab.type }" missing!<br/><br/>
                Did you forget to install a plugin?
            </>}
        </div>;
    });

    let chalEl;
    if (challenge || isEditor) {
        if (challenge.type)
            handler = plugins.challengeType[challenge.type];
        else
            handler = plugins.challengeType["__default"];

        if (!handler)
            chalEl = <>
                Challenge renderer for type "{ challenge.type }" missing!<br/><br/>
                Did you forget to install a plugin?
            </>;
        else chalEl = handler.generator(challenge, hideChal, isEditor, saveEdit);
        
        chalEl = <Modal onHide={hideChal}>
            { chalEl }
        </Modal>;
    }

    return <Page title={"Challenges"} selfContained>
        { chalEl }
        <div style={{display: "flex", flexGrow: "1"}}>
            <SBWrapWrap><SBWrap>
            <Sidebar sbHidden={sbHidden}>
                <div className={"head"}>Categories</div>
                {
                    api.challenges.map((tab, n) => 
                        <div key={n} className={activeTab === n ? "active" : ""}
                            onClick={() => {setActiveTab(n)}}
                        >{tab.title}</div>
                    )
                }
            </Sidebar>
            <SBBurger sbHidden={sbHidden} onClick={() => setSbHidden(!sbHidden)}><MdKeyboardArrowLeft/></SBBurger>
            </SBWrap></SBWrapWrap>
            <ChallengeBody>
                { challengeTabs }
            </ChallengeBody>
        </div>
    </Page>;
};
