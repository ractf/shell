import React, { useState, useContext, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from 'react-i18next';

import {
    appContext, Button, Input, TextBlock, Form, FormError, Radio, SBTSection,
    apiEndpoints, Link, apiContext, Select, plugins, HR, FlexRow, FlashText
} from "ractf";

import Split from "./Split";
import File from "./File";
import Hint from "./Hint";

import "./Challenge.scss";


export default ({ challenge, isEditor, isCreator, saveEdit, removeChallenge, category, rightComponent }) => {
    const [isEditFiles, setEditFiles] = useState(false);
    const [isEditHints, setEditHints] = useState(false);
    const [isEditRaw, setEditRaw] = useState(false);
    const [flagValid, setFlagValid] = useState(false);
    const [message, setMessage] = useState(null);
    const [locked, setLocked] = useState(false);
    const onFlagResponse = useRef();

    const regex = /^ractf{.+}$/;
    const partial = /^(?:r|$)(?:a|$)(?:c|$)(?:t|$)(?:f|$)(?:{|$)(?:[^]+|$)(?:}|$)$/;
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const api = useContext(apiContext);

    const { t } = useTranslation();

    const changeFlag = (flag) => {
        if (challenge.challenge_type === "freeform" || challenge.challenge_type === "longText")
            return setFlagValid(!!flag);
        setFlagValid(regex.test(flag));
    };

    const promptHint = (hint) => {
        return () => {
            if (hint.used) return app.alert(hint.name + ":\n" + hint.text);

            let msg = <>
                Are you sure you want to use a hint?<br /><br />
                This hint will deduct {hint.penalty} points from this challenge.
            </>;
            app.promptConfirm({ message: msg, small: true }).then(() => {
                endpoints.useHint(hint.id).then(body =>
                    app.alert(hint.name + ":\n" + body.text)
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
                    if (onFlagResponse.current)
                        onFlagResponse.current(true);
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
                if (onFlagResponse.current)
                    onFlagResponse.current(false, endpoints.getError(e));
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
                    file && <File key={file.id} name={file.name} url={file.url} id={file.id} size={file.size} isEdit />
                )}
            </div>

            <FlexRow>
                <Button click={addFile}>Add File</Button>
                <Button click={() => setEditFiles(false)}>Close</Button>
            </FlexRow>
        </>;
    }

    if (isEditHints) {
        return <>
            <div className={"challengeTitle"}>{challenge.name} - Hints</div>

            <div className={"challengeLinkGroup"}>
                {challenge.hints.map(hint =>
                    <Hint key={hint.id} points={hint.penalty} name={hint.name} id={hint.id} body={hint.text} isEdit />
                )}
            </div>

            <FlexRow>
                <Button click={addHint}>Add Hint</Button>
                <Button click={() => setEditHints(false)}>Close</Button>
            </FlexRow>
        </>;
    }

    if (isEditRaw) {
        let fields = [];
        Object.keys(plugins.challengeMetadata).forEach(key => {
            let i = plugins.challengeMetadata[key];
            let n = 0;
            if (!i.check || i.check(challenge, category)) {
                i.fields.forEach(field => {
                    switch (field.type) {
                        case "multiline":
                        case "code":
                        case "text":
                        case "number":
                            fields.push(<label key={key + (n++)} htmlFor={field.name}>{field.label}</label>);
                            let val = challenge.challenge_metadata[field.name];
                            let format = field.type === "number" ? /\d+/ : /.+/;
                            fields.push(
                                <Input val={val !== undefined ? val.toString() : undefined} name={field.name}
                                    placeholder={field.label} format={format} key={key + (n++)}
                                    rows={field.type === "multiline" || field.type === "code" ? 5 : ""}
                                    monospace={field.type === "code"} />
                            );
                            break;
                        case "select":
                            fields.push(<label key={key + (n++)} htmlFor={field.name}>{field.label}</label>);
                            let idx = field.options.map(i => i.key).indexOf(challenge.challenge_metadata[field.name]);
                            fields.push(
                                <Select name={field.name} options={field.options}
                                    key={key + (n++)} initial={idx !== -1 ? idx : 0} />
                            );
                            break;
                        case "label":
                            fields.push(<div key={key + (n++)}>{field.label}</div>);
                            break;
                        case "hr":
                            fields.push(<HR key={key + (n++)} />);
                            break;
                        default:
                            fields.push(<div key={key + (n++)}>"Unknown field type: " + field.type</div>);
                            break;
                    }
                });
            }
        });
        const saveEdit = (changes) => {
            challenge.challenge_metadata = {
                ...challenge.challenge_metadata,
                ...changes
            };
            setEditRaw(false);
        };

        return <div style={{ width: "100%" }}><Form handle={saveEdit}>
            {fields}
            <FlexRow>
                <Button click={() => setEditRaw(false)}>Cancel</Button>
                <Button submit>Save Edit</Button>
            </FlexRow>
        </Form></div>;
    }

    let flagInput = null;
    if (!isEditor) {
        switch (challenge.challenge_type) {
            case "code":
                break;
            case "map":
                break;
            case "freeform":
                flagInput = <Input placeholder="Flag"
                    name={"flag"} onChange={changeFlag}
                    light monospace
                    center width={"80%"} />;
                break;
            case "longText":
                flagInput = <Input rows={5} placeholder="Flag text"
                    format={partial} name={"flag"}
                    onChange={changeFlag} light monospace
                    center width={"80%"} />;
                break;
            default:
                flagInput = <Input placeholder="Flag format: ractf{...}"
                    format={partial} name={"flag"}
                    onChange={changeFlag} light monospace
                    center width={"80%"} />;
                break;
        }
    }

    let challengeMods = [];
    Object.keys(plugins.challengeMod).forEach(key => {
        let i = plugins.challengeMod[key];
        if (!i.check || i.check(challenge, category)) {
            challengeMods.push(React.createElement(i.component, {
                challenge: challenge, category: category, key: key,
            }));
        }
    });

    let rightSide = null;
    if (!isEditor && rightComponent)
        rightSide = React.createElement(rightComponent, { challenge: challenge });

    let chalContent = <>
        {isEditor ? <div style={{ width: "100%" }}><Form handle={saveEdit(challenge)}>
            <label htmlFor={"name"}>{t("editor.chal_name")}</label>
            <Input val={challenge.name} name={"name"} placeholder={t("editor.chal_name")} />
            <label htmlFor={"score"}>{t("editor.chal_points")}</label>
            <Input val={challenge.score !== undefined ? challenge.score.toString() : undefined} name={"score"}
                placeholder={t("editor.chal_points")} format={/\d+/} />
            <label htmlFor={"author"}>{t("editor.chal_author")}</label>
            <Input val={challenge.author} name={"author"} placeholder={t("editor.chal_author")} />

            <label htmlFor={"description"}>{t("editor.chal_brief")}</label>
            <Input rows={5} val={challenge.description} name={"description"} placeholder={t("editor.chal_brief")} />

            <label htmlFor={"challenge_type"}>{t("editor.chal_type")}</label>
            <Select options={Object.keys(plugins.challengeType).map(i => ({ key: i, value: i }))}
                initial={Object.keys(plugins.challengeType).indexOf(challenge.challenge_type)}
                name={"challenge_type"} />

            <label htmlFor={"flag_type"}>{t("editor.chal_flag_type")}</label>
            <Input placeholder={t("editor.chal_flag_type")} name={"flag_type"} monospace
                val={challenge.flag_type} />
            <label htmlFor={"flag_metadata"}>{t("editor.chal_flag")}</label>
            <Input placeholder={t("editor.chal_flag")}
                name={"flag_metadata"} monospace format={{
                    test: i => { try { JSON.parse(i); return true; } catch (e) { return false; } }
                }}
                val={JSON.stringify(challenge.flag_metadata)} />

            {!isCreator &&
                <FlexRow>
                    <Button click={() => setEditFiles(true)}>{t("editor.files")}</Button>
                    <Button click={() => setEditHints(true)}>{t("editor.hints")}</Button>
                    <Button click={() => setEditRaw(true)}>{t("editor.metadata")}</Button>
                </FlexRow>
            }

            <div>
                {t("editor.auto_unlock")}
                <Radio name={"autoUnlock"} value={!!challenge.auto_unlock}
                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
            </div>

            <FlexRow>
                {!isCreator && <Button click={removeChallenge} warning>{t("editor.remove")}</Button>}
                <Button submit>{isCreator ? t("editor.create") : t("editor.save")}</Button>
            </FlexRow>
        </Form></div> : <>
                {challengeMods}
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

                {challenge.files && !!challenge.files.length && <div className={"challengeLinkGroup"}>
                    {challenge.files.map(file =>
                        file && <File name={file.name} url={file.url} size={file.size} key={file.id} id={file.id} />
                    )}
                </div>}
                {api.user.team && challenge.hints && !!challenge.hints.length && <div className={"challengeLinkGroup"}>
                    {challenge.hints && !challenge.solved && challenge.hints.map((hint, n) => {
                        return <Hint name={hint.name} onClick={promptHint(hint)} hintUsed={hint.used}
                            points={hint.penalty} id={hint.id} key={hint.id} />;
                    })}
                </div>}
                
                {challenge.solved ? <>
                    {t("challenge.already_solved")}
                </> : api.user.team ? <Form handle={tryFlag(challenge)} locked={locked}>
                    {flagInput && <>
                        {flagInput}
                        {message && <FormError>{message}</FormError>}
                        <Button disabled={!flagValid} submit>{t("challenge.attempt")}</Button>
                    </>}
                </Form> : <FlashText warning bold>
                    {t("challenge.no_team")}
                    <FlexRow>
                        <Button to={"/team/new"}>{t("join_a_team")}</Button>
                        <Button to={"/team/new"}>{t("create_a_team")}</Button>
                    </FlexRow>
                </FlashText>}
            </>}
    </>;

    if (!isEditor) {
        let solveMsg = (challenge.first_blood_name
            ? t("challenge.first_solve", { name: challenge.first_blood_name })
            : t("challenge.no_solve"));

        chalContent = <SBTSection subTitle={<>{t("point_count", { count: challenge.score })} - {solveMsg}</>}
            title={challenge.name}>
            <Link className={"backToChals"} to={".."}>{t("back_to_chal")}</Link>
            {chalContent}
        </SBTSection>;
    }
    return <Split submitFlag={tryFlag(challenge)} onFlagResponse={onFlagResponse}>
        <>{chalContent}</>
        {rightSide}
    </Split>;
};
