import React, { useState, useContext } from "react";

import { apiContext, appContext } from "ractf";

import { Title, ChalWorth, ChalMeta } from "./Text";
import { Button, Input, TextBlock } from "ractf";

import File from "./File";
import Hint from "./Hint";
import { LinkGroup } from "./ChallengeLinks"


const HintModal = () => <h1>hi</h1>


export default ({ challenge, doHide }) => {
    const [flag, setFlag] = useState("");
    const [flagValid, setFlagValid] = useState(false);
    const [hint, setHint] = useState(null);

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const api = useContext(apiContext);

    const changeFlag = (flag) => {
        setFlag(flag);
        setFlagValid(regex.test(flag));
    }

    const useHint = () => {
        setHint(null);
    }

    const app = useContext(appContext);
    const promptHint = (hint) => {
        return () => {
            console.log(hint);
            let msg = <>
                Are you sure you want to use a hint?<br/><br/>
                This hint will deduct {hint.cost} points from this challenge.
            </>;
            app.promptConfirm({message: msg, small: true}).then(() => {
                alert("Hint!!!!");
            }).catch(() => {});
        };
    }

    return <>
        {hint && <HintModal cancel={(() => setHint(null))} okay={useHint} />}

        <Title>{challenge.name}</Title>
        <ChalWorth>{challenge.points} Points</ChalWorth>

        <ChalMeta>
            {challenge.first ? "First solved by " + challenge.first : "Nobody has solved this challenge yet"}
        </ChalMeta>

        <TextBlock dangerouslySetInnerHTML={{ __html: challenge.desc }} />

        {!challenge.solve && <>
            <Input callback={changeFlag}
                placeholder="Flag format: ractf{...}"
                format={partial}
                center width={"80%"} />
            <Button disabled={!flagValid}>Attempt flag</Button>
        </>}

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
    </>;
};
