import React, { useState, useContext } from "react";
import ReactMarkdown from "react-markdown";

import {
    appContext, Button, Input, TextBlock, Form, FormError, Radio, SBTSection,
    apiEndpoints, Link
} from "ractf";

import File from "./File";
import Hint from "./Hint";
import IDE from "./IDEGood";

import "./Challenge.scss";
import { ButtonRow } from "../../../components/Button";
import CodeInput from "./CodeInput";

const HintModal = () => <h1>hi</h1>;


export default ({ challenge, isEditor, isCreator, saveEdit }) => {
    const [isEditFiles, setEditFiles] = useState(false);
    const [isEditHints, setEditHints] = useState(false);
    const [isEditRaw, setEditRaw] = useState(false);
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const [hint, setHint] = useState(null);
    const [mdRaw, setMdRaw] = useState(JSON.stringify(challenge.challenge_metadata, null, 4));

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);

    const changeFlag = (flag) => {
        setFlagValid(regex.test(flag));
    };

    const useHint = () => {
        setHint(null);
    };

    const promptHint = (hint) => {
        return () => {
            if (hint.hint_used) return app.alert(hint.name + ":\n" + hint.body);

            let msg = <>
                Are you sure you want to use a hint?<br /><br />
                This hint will deduct {hint.cost} points from this challenge.
            </>;
            app.promptConfirm({ message: msg, small: true }).then(() => {
                endpoints.useHint(hint.id).then(body =>
                    app.alert(hint.name + ":\n" + body)
                ).catch(e =>
                    app.alert("Error using hint:\n" + endpoints.getError(e))
                );
            }).catch(() => { });
        };
    };

    const tryFlag = challenge => {
        return ({ flag }) => {
            setLocked(true);
            endpoints.attemptFlag(flag, challenge).then(resp => {
                if (resp.d.correct) {
                    app.alert("Flag correct!");
                    challenge.solved = true;

                    // NOTE: This is potentially very slow. If there are performance issues in production, this is
                    // where to look first!
                    endpoints._reloadCache();
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
                setMessage(endpoints.getError(e));
                setLocked(false);
            });
        };
    };

    const addFile = () => {
        app.promptConfirm({ message: "New file", },
            [{ name: 'name', placeholder: 'File name', label: "Name" },
            { name: 'url', placeholder: 'File URL', label: "URL" },
            { name: 'size', placeholder: 'File size', label: "Size (bytes)", format: /\d+/ }]
        ).then(({ name, url, size }) => {
            if (!size.match(/\d+/)) return app.alert("Invalid file size!");

            endpoints.newFile(challenge.id, name, url, size).then((id) => {
                challenge.files.push(id);
                app.alert("New file added!");
            }).catch(e =>
                app.alert("Error creating new file:\n" + endpoints.getError(e))
            );
        });
    };

    const addHint = () => {
        app.promptConfirm({ message: "New hint" },
            [{ name: 'name', placeholder: 'Hint name', label: "Name" },
            { name: 'cost', placeholder: 'Hint cost', label: "Cost", format: /\d+/ },
            { name: 'body', placeholder: 'Hint text', label: "Message", rows: 5 }]
        ).then(({ name, cost, body }) => {

            if (!cost.match(/\d+/)) return app.alert("Invalid file size!");

            endpoints.newHint(challenge.id, name, cost, body).then(() =>
                app.alert("New hint added!")
            ).catch(e =>
                app.alert("Error creating new hint:\n" + endpoints.getError(e))
            );
        });
    };

    if (isEditFiles) {
        return <>
            <div className={"challengeTitle"}>{challenge.name} - Files</div>

            <div className={"challengeLinkGroup"}>
                {challenge.files.map(file =>
                    <File key={file.id} name={file.name} url={file.url} id={file.id} size={file.size} isEdit />
                )}
            </div>

            <ButtonRow>
                <Button click={addFile}>Add File</Button>
                <Button click={() => setEditFiles(false)}>Close</Button>
            </ButtonRow>
        </>;
    }

    if (isEditHints) {
        return <>
            <div className={"challengeTitle"}>{challenge.name} - Hints</div>

            <div className={"challengeLinkGroup"}>
                {challenge.hints.map(hint =>
                    <Hint key={hint.id} points={hint.cost} name={hint.name} id={hint.id} body={hint.body} isEdit />
                )}
            </div>

            <ButtonRow>
                <Button click={addHint}>Add Hint</Button>
                <Button click={() => setEditHints(false)}>Close</Button>
            </ButtonRow>
        </>;
    }

    if (isEditRaw) {
        const saveEditRaw = () => {
            let challenge_metadata;
            try {
                challenge_metadata = JSON.parse(mdRaw);
            } catch (e) {
                app.alert(<>Failed to save metadata:<br /><br /><pre><code>{e.toString()}</code></pre></>);
                return;
            }
            challenge.challenge_metadata = challenge_metadata;
            setEditRaw(false);
        };

        return <div style={{ width: "100%" }}><Form handle={() => { }}>
            <CodeInput lang={"javascript"} val={mdRaw} onChange={setMdRaw} />
            <ButtonRow>
                <Button click={() => setEditRaw(false)}>Cancel</Button>
                <Button click={() => saveEditRaw()}>Save Edit</Button>
            </ButtonRow>
        </Form></div>;
    }

    let chalContent = <>
        {hint && <HintModal cancel={(() => setHint(null))} okay={useHint} />}

        {isEditor ? <div style={{ width: "100%" }}><Form handle={saveEdit(challenge)}>
            <label htmlFor={"name"}>Challenge name</label>
            <Input val={challenge.name} name={"name"} placeholder={"Challenge name"} />
            <label htmlFor={"score"}>Challenge points</label>
            <Input val={challenge.score && challenge.score.toString()} name={"score"}
                placeholder={"Challenge points"} format={/\d+/} />
            <label htmlFor={"author"}>Challenge author</label>
            <Input val={challenge.author} name={"author"} placeholder={"Challenge author"} />

            <label htmlFor={"description"}>Challenge brief</label>
            <Input rows={5} val={challenge.description} name={"description"} placeholder={"Challenge brief"} />

            <label htmlFor={"flag_type"}>Challenge flag type</label>
            <Input placeholder="Challenge flag type" name={"flag_type"} monospace
                val={challenge.flag_type} />
            <label htmlFor={"flag_metadata"}>Challenge flag</label>
            <Input placeholder="Challenge flag"
                name={"flag_metadata"} monospace format={{
                    test: i => { try { JSON.parse(i); return true; } catch (e) { return false; } }
                }}
                val={JSON.stringify(challenge.flag_metadata)} />

            <ButtonRow>
                <Button click={() => setEditFiles(true)}>Edit Files</Button>
                <Button click={() => setEditHints(true)}>Edit Hints</Button>
                <Button click={() => setEditRaw(true)}>Edit Metadata</Button>
            </ButtonRow>

            <div>
                Always Unlocked
                <Radio name={"autoUnlock"} value={!!challenge.auto_unlock}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>

            <ButtonRow>
                {!isCreator && <Button warning disabled>Remove Challenge</Button>}
                <Button submit>{isCreator ? "Create" : "Save"} Challenge</Button>
            </ButtonRow>
        </Form></div> : <>
                <TextBlock className={"challengeBrief"}>
                    <ReactMarkdown
                        source={challenge.description}
                        renderers={{
                            link: ({ href, children }) => (
                                <a rel="noopener noreferrer" target="_blank" href={href}>{children}</a>
                            ),
                            delete: ({ children }) => <span className="redacted">{children}</span>
                        }}
                    />
                </TextBlock>

                {challenge.solved ? <>
                    You have already solved this challenge!
                </> : <Form handle={tryFlag(challenge)} locked={locked}>
                        <Input placeholder="Flag format: ractf{...}"
                            format={partial} name={"flag"}
                            callback={changeFlag} light monospace
                            center width={"80%"} />
                        {message && <FormError>{message}</FormError>}
                        <Button disabled={!flagValid} submit>Attempt flag</Button>
                    </Form>}

                {challenge.files && !!challenge.files.length && <div className={"challengeLinkGroup"}>
                    {challenge.files.map(file => {
                        return <File name={file.name} url={file.url} size={file.size} key={file.id} id={file.id} />;
                    })}
                </div>}
                {challenge.hints && !!challenge.hints.length && <div className={"challengeLinkGroup"}>
                    {challenge.hints && !challenge.solved && challenge.hints.map((hint, n) => {
                        return <Hint name={hint.name} onClick={promptHint(hint)} hintUsed={hint.hint_used}
                            points={hint.cost} id={hint.id} key={hint.id} />;
                    })}
                </div>}
            </>}
    </>;

    if (!isEditor) {
        let solveMsg = (challenge.first_blood_name
            ? "First solved by " + challenge.first_blood_name
            : "Nobody has solved this challenge yet");

        chalContent = <SBTSection subTitle={challenge.score + " points - " + solveMsg} title={challenge.name}>
            <Link className={"backToChals"} to={".."}>Back to challenges</Link>
            {chalContent}
        </SBTSection>;

        if (challenge.flag_type === "code")
            chalContent = <IDE challenge={challenge}>
                {chalContent}
            </IDE>;
    }
    return chalContent;
};
