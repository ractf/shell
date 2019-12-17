import React, { useState, useContext } from "react";

import { apiContext, appContext, Button, Input, TextBlock, Form, FormError, Radio } from "ractf";

import File from "./File";
import Hint from "./Hint";

import "./Challenge.scss";


const HintModal = () => <h1>hi</h1>


export default ({ challenge, doHide, isEditor, isCreator, saveEdit }) => {
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const [hint, setHint] = useState(null);

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const api = useContext(apiContext);
    const app = useContext(appContext);

    const changeFlag = (flag) => {
        setFlagValid(regex.test(flag));
    };

    const useHint = () => {
        setHint(null);
    };

    const promptHint = (hint) => {
        return () => {
            let msg = <>
                Are you sure you want to use a hint?<br /><br />
                This hint will deduct {hint.cost} points from this challenge.
            </>;
            app.promptConfirm({ message: msg, small: true }).then(() => {
                alert("Hint!!!!");
            }).catch(() => { });
        };
    };

    const tryFlag = challenge => {
        return ({ flag }) => {
            setLocked(true);
            api.attemptFlag(flag, challenge).then(resp => {
                if (resp.d.correct) {
                    app.alert("Flag correct!");
                    challenge.solved = true;

                    // NOTE: This is potentially very slow. If there are performance issues in production, this is
                    // where to look first!
                    api._reloadCache().then(() => doHide());
                    /*  // This is the start of what would be the code to rebuild the local cache
                    api.challenges.forEach(group => group.chals.forEach(chal => {
                        if (chal.deps.indexOf(challenge.id) !== -1) {
                            chal.lock = false;
                        }
                    }));
                    */
                } else {
                    app.alert("Incorrect flag");
                }
                setLocked(false);
            }).catch(e => {
                setMessage(api.getError(e));
                console.log(e);
                setLocked(false);
            });
        }
    };

    return <>
        {hint && <HintModal cancel={(() => setHint(null))} okay={useHint} />}

        {isEditor ? <div style={{ width: "100%" }}><Form handle={saveEdit(challenge)}>
            <label htmlFor={"name"}>Challenge name</label>
            <Input val={challenge.name} name={"name"} placeholder={"Challenge name"} />
            <label htmlFor={"points"}>Challenge points</label>
            <Input val={challenge.base_score} name={"points"} placeholder={"Challenge points"} format={/\d+/} />

            <label htmlFor={"desc"}>Challenge brief</label>
            <Input rows={5} val={challenge.description} name={"desc"} placeholder={"Challenge brief"} />

            <label htmlFor={"flag"}>Challenge flag type</label>
            <Input placeholder="Challenge flag type" name={"flag_type"} monospace
                val={challenge.flag_type} />
            <label htmlFor={"flag"}>Challenge flag</label>
            <Input placeholder="Challenge flag"
                name={"flag"} monospace format={{ test: i => { try { JSON.parse(i); return true; } catch (e) { return false; } } }}
                val={challenge.flag} />

            <div>
                Always Unlocked
                <Radio name={"autoUnlock"} value={challenge.auto_unlock}
                       options={[["Enabled", true], ["Disabled", false]]} />
            </div>

            <Button submit>{isCreator ? "Create" : "Save"} Challenge</Button>
        </Form></div> : <>
                <div className={"challengeTitle"}>{challenge.name}</div>
                <div className={"challengeWorth"}>{challenge.base_score} Points</div>

                <div className={"challengeMeta"}>
                    {challenge.first ? "First solved by " + challenge.first : "Nobody has solved this challenge yet"}
                </div>

                <TextBlock className={"challengeBrief"} dangerouslySetInnerHTML={{ __html: challenge.description }} />

                {challenge.solved ? <>
                    You have already solved this challenge!
                </> : <Form handle={tryFlag(challenge)} locked={locked}>
                    <Input placeholder="Flag format: ractf{...}"
                        format={partial} name={"flag"}
                        callback={changeFlag} monospace
                        center width={"80%"} />
                    {message && <FormError>{message}</FormError>}
                    <Button disabled={!flagValid} submit>Attempt flag</Button>
                </Form>}

                {challenge.files && !!challenge.files.length && <div className={"challengeLinkGroup"}>
                    {challenge.files.map(file => {
                        return <File name={file.name} url={file.url} size={file.size} />;
                    })}
                </div>}
                {challenge.hint && !!challenge.hint.length && <div className={"challengeLinkGroup"}>
                    {challenge.hint && !challenge.solve && challenge.hint.map((hint, n) => {
                        return <Hint name={"Hint " + (n + 1)} onClick={promptHint(hint)} points={hint.cost} />;
                    })}
                </div>}
            </>}
    </>;
};
