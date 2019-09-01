import React, { useState, useContext } from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";
import { FaCheck, FaLockOpen, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

import { APIContext } from "../controllers/API";

import Input from "../../components/Input";
import Button, { ButtonRow } from "../../components/Button";
import TabbedView from "../../components/TabbedView";
import { TextBlock, SectionTitle, SectionTitle2, SectionBlurb } from "../../components/Misc";

import Page from "./bases/Page";

import theme from "theme";


const node_size = "10rem";
const node_inner = "9rem";
const link_size = "5rem";
const link_part = "1.3rem";
const node_margin = "2.5rem";
const icon_size = "1.5rem";

const ChalNode_ = styled.div`
    width: ${node_size};
    height: ${node_size};
    border-radius: 50%;
    border: 4px solid ${theme.bg_l1};
    background-color: ${transparentize(.4, theme.bg)};
    position: relative;
    color: ${theme.fg};
    padding: 16px;

    >*:first-child {
        position: relative;
        font-size: 1.2em;
        width: ${node_inner};

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        z-index: 50;
        color: ${theme.fg};
        font-weight: 400;
    }
    +div::after, +div::before {
        background-color: ${theme.bg_l1};
    }
    margin: 0 ${node_margin};
    &:first-child {
        margin-left: 0;
    }
    &:last-child {
        margin-right: 0;
    }

    ${props => !(props.done || props.unlocked) ? css`
        color: ${theme.bg_l2};
        user-select: none;
    ` : css`
        cursor: pointer;
        color: ${theme.bg_l3};
        border-color: ${theme.bg_l3};

        &:hover {
            background-color: ${transparentize(.67, theme.bg_l1)};
        }
    `}

    ${props => props.done && css`
        border-color: #6b6;
        color: #6b6;
        
        &:hover {
            background-color: #66bb6633;
        }
    `}1
`;


const ChalNodeLink = styled.div`
    ${props => (props.left || props.right) && css`
        height: 4px;
        width: ${link_part};
        position: absolute;
        left: calc(100% + 4px);
        top: calc(50% - 2px);
        
        ${props => props.left && css`left: auto; right: calc(100% + 4px);`}
    `}
    ${props => (props.up || props.down) && css`
        width: 4px;
        height: ${link_part};
        position: absolute;
        top: calc(100% + 4px);
        left: calc(50% - 2px);
        
        ${props => props.up && css`top: auto; bottom: calc(100% + 4px);`}
    `}
    background-color: ${props => props.done ? "#6b6" : props.unlocked ? theme.bg_l3 : theme.bg_l1};
`;
const LockRight = styled.div`
    &>svg {
        font-size: ${icon_size};
        position: absolute;
        top: 50%;
        left: calc(100% + ${node_margin} + 4px);
        transform: translate(-50%, -50%);

        color: ${props => props.lockDone ? "#6b6" : props.lockUnlocked ? theme.bg_l3 : theme.bg_l2};
    }
`;
const LockDown = styled(LockRight)`
    &>svg {
        left: 50%;
        top: calc(100% + ${node_margin} + 4px);
    }
`;
const ChalNode = props => {
    return (
        <ChalNode_ tabIndex={props.unlocked || props.done ? "0" : ""} onMouseDown={(e => (e.target.click && e.target.click()))} onClick={(props.done || props.unlocked) && props.click} {...props}>
            <div>{props.name}</div>

            
            {props.right && <LockRight {...props}>{props.lockDone ? <FaCheck /> : props.lockUnlocked ? <FaLockOpen /> : <FaLock />}</LockRight>}
            {props.down && <LockDown {...props}>{props.lockDone ? <FaCheck /> : props.lockUnlocked ? <FaLockOpen /> : <FaLock />}</LockDown>}

            {props.left && <ChalNodeLink left done={props.done} unlocked={props.unlocked} />}
            {props.right && <ChalNodeLink right done={props.done} unlocked={props.unlocked} />}
            {props.up && <ChalNodeLink up done={props.done} unlocked={props.unlocked} />}
            {props.down && <ChalNodeLink down done={props.done} unlocked={props.unlocked} />}
        </ChalNode_>
    );
};

const CampaignRow = styled.div`
    display: flex;

    >* {
        flex-shrink: 0;
    }

    margin-bottom: ${link_size};
    &:last-child {margin-bottom: 0;}
    justify-content: center;
`;
const NodeSpacer = styled.div`
    margin-left: ${props => props.link ? link_size : node_size};
`;

const Darken = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
    z-index: -1;
`;
const ModalWrap = styled.div`
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const ModalBox = styled.div`
    border: 1px solid ${theme.bg_l1};
    padding: 20px 40px;
    background-color: ${theme.bg};
    box-shadow: 0 0 25px -10px #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 75vw;
`;
const Modal = ({onHide, children}) =>
    <ModalWrap>
        <Darken onMouseDown={(e => e.target.click())} onClick={onHide || (() => null)} />
        <ModalBox>
            {children}
        </ModalBox>
    </ModalWrap>;

const HintWarn = styled.div`
    color: #f00;
    margin-top: 8px;
    font-size: 1.2em;
`;
const HintModal = ({okay, cancel}) =>
    <Modal>
        <SectionTitle2>Are you sure you want to use a hint?</SectionTitle2>
        <HintWarn>This is irrevocable and will halve your points for this challenge.</HintWarn>

        <ButtonRow>
            <Button click={okay}>Use Hint</Button>
            <Button click={cancel} lesser>Nevermind</Button>
        </ButtonRow>
    </Modal>;

const ChalWorth = styled.div`
    margin-top: .5em;
    font-size: 1rem;
`;
const ChalMeta = styled.div`
    margin-top: 8px;
    font-size: .8em;
    margin-bottom: 2em;
`;
const Challenge = ({challenge, doHide}) => {
    const [flag, setFlag] = useState("");
    const [flagValid, setFlagValid] = useState(false);
    const [promptHint, setPromptHint] = useState(false);

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const api = useContext(APIContext);

    const changeFlag = (flag) => {
        setFlag(flag);
        setFlagValid(regex.test(flag));
    }

    const useHint = () => {
        setPromptHint(false);
    }

    return <Modal onHide={doHide}>
        {promptHint && <HintModal cancel={(() => setPromptHint(false))} okay={useHint} />}

        <SectionTitle>{challenge.name}</SectionTitle>
        <SectionTitle2>Challenge {challenge.number}</SectionTitle2>
        <ChalWorth>{challenge.points} Points</ChalWorth>

        <ChalMeta>
            12 people have solved this challenge.<br />
            First solved by Xela
        </ChalMeta>

        <TextBlock dangerouslySetInnerHTML={{ __html: challenge.description }} />

        {!challenge.done && <>
            <Input callback={changeFlag}
                placeholder="Flag format: ractf{...}"
                format={partial}
                center width={"80%"} />
            <Button disabled={!flagValid}>Attempt flag</Button>
            <Button click={(() => setPromptHint(true))}>Get hint</Button>
        </>}
    </Modal>;
};


const CampaignWrap = styled.div`
    margin: auto;
    padding: 4rem 0;
`;




export default (props) => {
    const [challenge, setChallenge] = useState(null);

    const showChallenge = (category, number, done) => {
        return () => {
            setChallenge({
                name: "[Object object]",
                number: number,
                points: "[Object object]",
                description: "[Object object]",
                category: category,
                done: done,
            })
        }
    }

    return <Page title={"Challenges"}>
        {challenge
            ? <Challenge doHide={(() => setChallenge(null))} challenge={challenge} />
            : null}

        <TabbedView center>

            <CampaignWrap label="Campaign">
                <SectionBlurb>
                    These campaign-style challenges are new for RACTF 2020!<br/>
                    Each challenge has a number of precursor challenges (except the first ones, of course), one of which must be completed before you can attempt the challenge.<br/>
                    Please let us know what you think of this style on our <a href={"https://discord.gg/FfW2xXR"}>Discord server</a>.
                </SectionBlurb>

                <CampaignRow top>
                    <ChalNode lockUnlocked done right click={showChallenge("campaign", 1, true)} name={"Intercepted Email"} />
                    <ChalNode unlocked right left click={showChallenge("campaign", 1, false)} name={"Fishy Forensics"} />
                    <ChalNode left down name={"???"} />
                </CampaignRow>

                <CampaignRow top>
                    <ChalNode right unlocked name={"A Criminal's First Steps"} />
                    <ChalNode left down name={"???"} />
                    <ChalNode down up name={"???"} />
                </CampaignRow>
                <CampaignRow>
                    <ChalNode right down name={"???"} />
                    <ChalNode left up down name={"???"} />
                    <ChalNode down up name={"???"} />
                </CampaignRow>
                <CampaignRow>
                    <ChalNode up down name={"???"} />
                    <ChalNode up down right name={"???"} />
                    <ChalNode up left name={"???"} />
                </CampaignRow>
                <CampaignRow>
                    <ChalNode up right name={"???"} />
                    <ChalNode up left right name={"???"} />
                    <ChalNode left name={"???"} />
                </CampaignRow>
            </CampaignWrap>
            <div label="Categorical Challenges" />
            <div label="RACTF 2019">
                <SectionBlurb>
                    A select number of challenges from RACTF 2019 have been resurrected for your enjoyment.<br/>
                    Writeups are available for a number of these challenges, and most of the challenge authors would be happy to explain what's going on in some of these.<br/><br/>
                    Note that these challenges aren't worth any points for RACTF 2020!
                </SectionBlurb>
            </div>
        </TabbedView>
    </Page>;
};
