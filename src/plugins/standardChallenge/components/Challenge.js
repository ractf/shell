import React, { useState, useContext } from "react";
import styled from "styled-components";

import { apiContext, appContext, Button, Input, TextBlock, Form, FormError } from "ractf";

import { Title, ChalWorth, ChalMeta } from "./Text";

import File from "./File";
import Hint from "./Hint";
import { LinkGroup } from "./ChallengeLinks"


const HintModal = () => <h1>hi</h1>


const ChallengeBrief = styled(TextBlock)`
    font-family: 'Special Elite', 'Robot Mono', monospace;
    text-align: left;
    line-height: 1.5;
`;

const EditorForm = styled.div`width: 100%;`;


export default ({ challenge, doHide, isEditor, saveEdit }) => {
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const [hint, setHint] = useState(null);

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const api = useContext(apiContext);

    const changeFlag = (flag) => {
        setFlagValid(regex.test(flag));
    }

    const useHint = () => {
        setHint(null);
    }

    const app = useContext(appContext);
    const promptHint = (hint) => {
        return () => {
            let msg = <>
                Are you sure you want to use a hint?<br/><br/>
                This hint will deduct {hint.cost} points from this challenge.
            </>;
            app.promptConfirm({message: msg, small: true}).then(() => {
                alert("Hint!!!!");
            }).catch(() => {});
        };
    }

    const tryFlag = challenge => {
        return ({ flag }) => {
            setLocked(true);
            api.attemptFlag(flag, challenge).then(() => {
                alert("yay");
                setLocked(false);
            }).catch(e => {
                setMessage(api.getError(e));
                console.log(api.getError(e));
                setLocked(false);
            });
        }
    };

    return <>
        {hint && <HintModal cancel={(() => setHint(null))} okay={useHint} />}

        { isEditor ? <EditorForm><Form handle={saveEdit(challenge)}>
            <Input val={challenge.uuid} name={"uuid"} hidden />
            <Input val={challenge.name} name={"name"} placeholder={"Challenge Name"} />
            <ChalWorth><Input val={challenge.points} name={"points"} placeholder={"Challenge Points"} format={/\d+/} /> Points</ChalWorth>

            <br/>
            <Input rows={5} val={challenge.desc} name={"desc"} placeholder={"Description"}/>

            <Input placeholder="Flag format: ractf{...}"
                format={partial} name={"flag"}
                val={challenge.flag} />
            
            <Button submit>Save Challenge</Button>
        </Form></EditorForm> : <>
            <Title>{challenge.name}</Title>
            <ChalWorth>{challenge.points} Points</ChalWorth>

            <ChalMeta>
                {challenge.first ? "First solved by " + challenge.first : "Nobody has solved this challenge yet"}
            </ChalMeta>

            <ChallengeBrief dangerouslySetInnerHTML={{ __html: challenge.desc }} />

            {!challenge.solve && <Form handle={tryFlag(challenge)} locked={locked}>
                <Input placeholder="Flag format: ractf{...}"
                       format={partial} name={"flag"}
                       callback={changeFlag}
                       center width={"80%"} />
                {message && <FormError>{message}</FormError>}
                <Button disabled={!flagValid} submit>Attempt flag</Button>
            </Form>}

            {challenge.files && !!challenge.files.length && <LinkGroup>
                {challenge.files.map(file => {
                    return <File name={file.name} url={file.url} size={file.size} />;
                })}
            </LinkGroup>}
            {challenge.hint && !!challenge.hint.length && <LinkGroup>
                {challenge.hint && !challenge.solve && challenge.hint.map((hint, n) => {
                    return <Hint name={"Hint " + (n + 1)} onClick={promptHint(hint)} points={hint.cost} />;
                })}
            </LinkGroup>}
        </>}
    </>;
};
