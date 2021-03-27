// Copyright (C) 2020-2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useContext, useCallback, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Checkbox, Button, Select, PageHead, InputTags,
    fromJson, Page, Column, Card, Grid, Modal, Markdown, Spoiler,
    FileUpload, TabbedView, Tab, SubtleText, UiKitModals, Container,
    Badge, Row, HR, ToggleButton
} from "@ractf/ui-kit";
import { NUMBER_RE, formatBytes } from "@ractf/util";
import { iteratePlugins, getPlugin, getClass } from "@ractf/plugins";
import { useChallenges, Challenge, ASTChallenge, ASTBinOp } from "@ractf/shell-util";
import { newHint } from "@ractf/api";
import * as http from "@ractf/util/http";

import * as actions from "actions";
import Link from "components/Link";

import File from "./File";
import Hint from "./Hint";


const UNLOCK_HELP = `
### Unlock requirements help
Unlock requirements are encoded using reverse polish notation.

For now, have this sloppy grammar:

\`\`\`
<code> ::= <term>
<term> ::= <challenge id>|<term> <term> AND|<term> <term> OR
<challenge id> ::= \\d+
\`\`\`
For example: \`1 2 OR 3 AND\` decodes as \`(1 OR 2) AND 3\`
`;


const UPLOAD_SPEED_HISTORY = 5;
const SUPPORTED_FILE_SIZE = 104857600;  // 100 MB
const LARGE_FILE_SIZE = 52428800;  // 50 MB

const MetadataEditor = ({ challenge, category, save }) => {
    const fields = [];

    iteratePlugins("challengeMetadata").forEach(({ plugin }) => {
        if (!plugin.check || plugin.check(challenge, category)) {
            fields.push(fromJson(plugin.fields, challenge.challenge_metadata));
        }
    });
    const saveEdit = useCallback((changes) => {
        try {
            save({
                ...(challenge.toJSON ? challenge.toJSON() : challenge), challenge_metadata: {
                    ...challenge.challenge_metadata,
                    ...changes
                }
            });
        } catch (e) {
            console.error(e);
        }
    }, [challenge, save]);

    return <div style={{ width: "100%" }}><Form handle={saveEdit}>
        {fields}
        <Button submit>Save Edit</Button>
    </Form></div>;
};

const HintEditor = ({ challenge }) => {
    const modals = useContext(UiKitModals);

    const addHint = useCallback(() => {
        modals.promptConfirm({ message: "New hint" },
            [{ name: "name", placeholder: "Hint name", label: "Name" },
            { name: "cost", placeholder: "Hint cost", label: "Cost", format: NUMBER_RE },
            { name: "body", placeholder: "Hint text", label: "Message", rows: 5 }]
        ).then(({ name, cost, body }) => {
            if (!cost.match(NUMBER_RE)) return modals.alert("Invalid hint cost!");

            newHint(challenge.id, name, cost, body).then(() =>
                modals.alert("New hint added!")
            ).catch(e =>
                modals.alert("Error creating new hint:\n" + http.getError(e))
            );
        });
    }, [modals, challenge.id]);

    return <>
        <Grid headings={["Name", "Cost", "Message", "Actions"]} data={challenge.hints.map(hint => [
            hint.name, hint.penalty, hint.text.length > 100 ? hint.text.substring(0, 100) + "\u2026" : hint.text,
            <Hint key={hint.id} {...hint} isEdit />
        ])} />
        <Button onClick={addHint}>Add Hint</Button>
    </>;
};

const FileEditor = ({ challenge }) => {
    const modals = useContext(UiKitModals);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("upload");
    const submitUpRef = useRef();
    const submitAddRef = useRef();
    const modalSubmit = useCallback(() => {
        if (activeTab === "upload") {
            uploadSpeedLog.current = [];
            submitUpRef.current();
        } else {
            submitAddRef.current();
        }
    }, [activeTab]);
    const uploadSpeedLog = useRef();

    const addFile = useCallback(() => {
        setModalOpen(true);
    }, []);
    const onClose = useCallback(() => {
        setModalOpen(false);
    }, []);
    const dispatch = useDispatch();
    const postSubmit = useCallback(({ resp }) => {
        dispatch(actions.addFile(challenge.id, resp));
        setModalOpen(false);
        modals.alert("New file added");
    }, [dispatch, challenge.id, modals]);
    const onUploadProgress = useCallback((event) => {
        uploadSpeedLog.current.push([event.loaded, new Date()]);
        while (uploadSpeedLog.current.length > UPLOAD_SPEED_HISTORY)
            uploadSpeedLog.current.shift();

        let speed = null;
        if (uploadSpeedLog.current.length > 1) {
            const deltaBytes = (
                uploadSpeedLog.current[uploadSpeedLog.current.length - 1][0]
                - uploadSpeedLog.current[0][0]
            );
            const deltaTime = (
                uploadSpeedLog.current[uploadSpeedLog.current.length - 1][1]
                - uploadSpeedLog.current[0][1]
            );
            speed = deltaBytes / (deltaTime / 1000);
        }

        modals.showProgress(
            `Uploaded ${formatBytes(event.loaded, 1)}/${formatBytes(event.total, 1)}`
            + (speed !== null ? ` (${formatBytes(speed, 1)}/s)` : ""),
            event.loaded / event.total
        );
    }, [modals]);
    const uploadFailed = useCallback(({ error }) => {
        modals.alert("Upload failed: " + http.getError(error));
    }, [modals]);
    const validator = useCallback(({ upload }) => {
        return new Promise((resolve, reject) => {
            const size = formatBytes(upload.size, 1);
            if (upload.size > SUPPORTED_FILE_SIZE)
                modals.promptConfirm({
                    message: `You are about to upload a file larger than officially supported (${size}). `
                        + "Are you sure you wish to proceed?",
                    small: true,
                    okay: "Abort",
                    cancel: "Proceed",
                }).catch(clickedButton => clickedButton ? resolve() : reject()).then(reject);
            else if (upload.size > LARGE_FILE_SIZE)
                modals.promptConfirm({
                    message: `You are about to upload a large file (${size}). `
                        + "Are you sure you wish to proceed?",
                    small: true,
                    okay: "Abort",
                    cancel: "Proceed",
                }).catch(clickedButton => clickedButton ? resolve() : reject()).then(reject);
            else resolve();
        });
    }, [modals]);

    const modal = <Modal header={"New file"} onClose={onClose} onConfirm={modalSubmit}
        okay={activeTab === "upload" ? "Upload File" : "Add File"}>
        <TabbedView active={activeTab} setActive={setActiveTab} neverUnmount>
            <Tab label={"Upload File"} index={"upload"}>
                <Form multipart method={"POST"} action={"/challenges/files/"}
                    postSubmit={postSubmit} submitRef={submitUpRef} onUploadProgress={onUploadProgress}
                    onError={uploadFailed} validator={validator}>
                    <Input hidden val={challenge.id} name={"challenge"} />
                    <Form.Group label={"Choose file"} htmlFor={"upload"}>
                        <FileUpload required name={"upload"} globalDrag />
                        <label><SubtleText>
                            Uploading files larger than {formatBytes(SUPPORTED_FILE_SIZE)} is not
                            officially supported. You may wish to instead upload files this large
                            to an alternative hosting provider and link the file instead.
                        </SubtleText></label>
                    </Form.Group>
                </Form>
            </Tab>
            <Tab label={"Link File"} index={"link"}>
                <Form multipart method={"POST"} action={"/challenges/files/"}
                    postSubmit={postSubmit} submitRef={submitAddRef} >
                    <Form.Group label={"File name"} htmlFor={"name"}>
                        <Input required name={"name"} placeholder={"File name"} />
                    </Form.Group>
                    <Form.Group label={"File URL"} htmlFor={"url"}>
                        <Input required name={"url"} placeholder={"File URL"} />
                    </Form.Group>
                    <Form.Group label={"File size (in bytes)"} htmlFor={"size"}>
                        <Input required name={"size"} placeholder={"File Size"} format={/\d+/} />
                    </Form.Group>
                    <Input hidden val={challenge.id} name={"challenge"} />
                </Form>
            </Tab>
        </TabbedView>
    </Modal>;

    return <>
        {modalOpen && modal}
        <Grid headings={["Name", "URL", "Size", "Actions"]} data={challenge.files.map(file => [
            file.name, <Link to={file.url}>{file.url}</Link>, file.size,
            <File key={file.id} {...file} isEdit />
        ])} />
        <Button onClick={addFile}>Add File</Button>
    </>;
};

const FlagMetadata = React.memo(({ flag_type, val, onChange }) => {
    const plugin = getPlugin("flagType", flag_type);
    if (!plugin) return null;

    return <Form onChange={onChange}>
        {fromJson(plugin.schema, val)}
    </Form>;
});
FlagMetadata.displayName = "FlagMetadata";


const SimpleUnlockEditor = ({ challenge, value, onChange }) => {
    const allChallenges = challenge.category.challenges.filter(
        j => j.id !== challenge.id).map(j => j.name);

    const ast = getClass(Challenge).tryParseAST(value, true)[1];
    let simpleRequirements = getClass(Challenge).getSimpleRequirementsStatic(ast);
    if (simpleRequirements === null) {
        simpleRequirements = ["OR", getClass(Challenge).astChallengesList(ast)];
    }
    const simplyRequiredChallenges = useChallenges(simpleRequirements[1]);

    const [challenges, setChallenges] = useState(simplyRequiredChallenges.map(i => i.name));
    const [mode, setMode] = useState(simpleRequirements[0]);

    useEffect(() => {
        const reverseMap = Object.fromEntries(simplyRequiredChallenges.map(i => [i.name, i.id]));
        const output = [];
        challenges.forEach(i => {
            output.push(reverseMap[i]);
            if (output.length !== 1)
                output.push(mode);
        });
        onChange(output.join(" "));
    }, [onChange, mode, challenges, simplyRequiredChallenges]);

    return <>
        <Row>
            {challenges.map((i, n) => <React.Fragment key={`${mode}|${i}`}>
                {(n !== 0) && <Badge lesser pill outline>{mode}</Badge>}
                <Badge pill>{i}</Badge>
            </React.Fragment>)}
        </Row>
        <HR />
        <Form.Group label={"Challenges"}>
            <InputTags name={"Challenges"} limit={allChallenges}
                val={challenges} onChange={setChallenges} />
        </Form.Group>
        <Form.Group label={"Mode"}>
            <ToggleButton small
                options={[["Any", "OR"], ["All", "AND"]]}
                default={mode} onChange={setMode}
            />
        </Form.Group>
    </>;
};

const UnlockPreview = ({ ast, value, simple }) => {
    if (!ast)
        ast = getClass(Challenge).tryParseAST(value, true)[1];
    const parsedChallenges = useChallenges(Challenge.astChallengesList(ast));
    const challengeMap = Object.fromEntries(parsedChallenges.map(i => [i.id, i]));

    const parse = (node, depth = 0, first = false) => {
        if (node instanceof ASTChallenge) {
            return [<Badge key={node._id} pill>
                {challengeMap[node.challenge_id]?.name || <i>Unknown Challenge</i>}
            </Badge>];
        } else if (node instanceof ASTBinOp) {
            return [
                (!first && !simple) && <Badge key={"(" + node._id} lesser secondary pill outline>(</Badge>,
                ...parse(node.left, depth + 1),
                <Badge lesser pill outline key={node._id}>{node.op}</Badge>,
                ...parse(node.right, depth + 1),
                (!first && !simple) && <Badge key={")" + node._id} lesser secondary pill outline>)</Badge>,
            ];
        }
        return [];
    };
    return <Row children={parse(ast, 0, true)} />;
};

const UnlockEditor = ({ challenge, value, onClose, onChange }) => {
    const [isAdvanced, setAdvanced] = useState(() => {
        return getClass(Challenge).getSimpleRequirementsStatic(
            getClass(Challenge).tryParseAST(value, true)[1]
        ) === null;
    });
    const modals = useContext(UiKitModals);
    const [simpleVal, setSimpleVal] = useState(value);

    const switchSimple = () => {
        modals.promptConfirm(
            "Switching to simple mode will discard edits made in advanced mode. Switch anyway?"
        ).then(() => {
            setAdvanced(false);
        }).catch(() => { });
    };

    const onConfirm = () => {
        if (!isAdvanced) {
            onChange(simpleVal);
            onClose();
        } else {
            if (validationError) {
                modals.alert("There are errors with your code. Please either fix the errors, or discard changes.");
            } else {
                onChange(parsed.serialized);
                onClose();
            }
        }
    };

    const [validationError, setValidationError] = useState(null);
    const [parsed, setParsed] = useState();
    const updateValError = ({ code }) => {
        const [success, astOrError] = getClass(Challenge).tryParseAST(code);
        setValidationError(success ? null : astOrError);
        setParsed(success ? astOrError : null);
    };
    useEffect(() => {
        updateValError({ code: value });
    }, [value, isAdvanced]);
    const simpleOnChange = useCallback((code) => {
        setSimpleVal(code);
    }, [setSimpleVal]);

    return <Modal header={"Edit Unlock Requirements"} buttons={
        !isAdvanced ? (
            <Button lesser small warning onClick={() => setAdvanced(true)}>
                Switch to advanced mode
            </Button>
        ) : (
            <Button lesser small danger onClick={switchSimple}>
                Switch to simple mode
            </Button>
        )
    } noHide onClose={onClose} onConfirm={onConfirm}>
        {!isAdvanced ? <>
            <SimpleUnlockEditor onChange={simpleOnChange} value={simpleVal} challenge={challenge} />
        </> : <>
            <UnlockPreview ast={parsed} />
            <HR />
            <Form onChange={updateValError}>
                <Form.Group label={"Unlock requirements code:"} error="test">
                    <Input name={"code"} value={value} />
                </Form.Group>
                <Form.Error>{validationError}</Form.Error>
            </Form>
            <Spoiler title={"Unlock code documentation"}>
                <Markdown source={UNLOCK_HELP} />
            </Spoiler>
        </>}
    </Modal>;
};


const Editor = ({ challenge, category, isCreator, saveEdit, removeChallenge, embedded }) => {
    const { t } = useTranslation();

    const editTransformer = useCallback((data) => {
        return { ...data, tags: data.tags ? data.tags.map(i => ({ type: "tag", text: i })) : [] };
    }, []);

    const [unlockOpen, setUnlockOpen] = useState(false);

    const body = (
        <Form handle={saveEdit} transformer={editTransformer}>
            {unlockOpen ?
                <UnlockEditor name={"unlock_requirements"} challenge={challenge}
                    value={challenge.unlock_requirements}
                    onClose={() => setUnlockOpen(false)} />
                : <Input hidden name={"unlock_requirements"}
                    val={challenge.unlock_requirements} />
            }

            <Container.Row>
                <Column lgWidth={6} mdWidth={12}>
                    <Card lesser header={"Unlock Requirements"} collapsible>
                        <UnlockPreview receive={"unlock_requirements"} />
                        <Button small onClick={() => setUnlockOpen(true)}>Open Editor</Button>
                    </Card>

                    <Card lesser header={"Basic settings"} collapsible>
                        <Form.Group htmlFor={"name"} label={t("editor.chal_name")}>
                            <Input val={challenge.name} name={"name"} placeholder={t("editor.chal_name")} required />
                        </Form.Group>
                        <Form.Group htmlFor={"score"} label={t("editor.chal_points")}>
                            <Input val={challenge.score !== undefined ? challenge.score.toString() : undefined}
                                name={"score"} placeholder={t("editor.chal_points")} format={NUMBER_RE} required />
                        </Form.Group>
                        <Form.Group htmlFor={"author"} label={t("editor.chal_author")}>
                            <Input val={challenge.author} name={"author"} placeholder={t("editor.chal_author")}
                                required />
                        </Form.Group>
                        <Form.Group htmlFor={"description"} label={t("editor.chal_brief")}>
                            <Input rows={5} val={challenge.description} name={"description"}
                                placeholder={t("editor.chal_brief")} required />
                        </Form.Group>
                        <Form.Group htmlFor={"tags"} label={t("editor.tags")}>
                            <InputTags name={"tags"} val={challenge.tags} />
                        </Form.Group>
                    </Card>
                    <Card lesser header={"Advanced settings"} collapsible startClosed>
                        <Form.Group htmlFor={"post_score_explanation"} label={t("editor.post_score_explanation")}>
                            <Input rows={3} val={challenge.post_score_explanation} name={"post_score_explanation"}
                                placeholder={t("editor.post_score_explanation")} />
                        </Form.Group>
                    </Card>
                    <Card lesser header={"Metadata"} collapsible startClosed>
                        <MetadataEditor category={category} challenge={challenge} save={saveEdit} />
                    </Card>
                </Column>
                <Column lgWidth={6} mdWidth={12}>
                    <Card lesser header={"Display settings"} collapsible>
                        <Form.Row>
                            <Checkbox val={!!challenge.hidden} name={"hidden"}>
                                {t("editor.hide_challenge")}
                            </Checkbox>
                        </Form.Row>

                        <Form.Group htmlFor={"challenge_type"} label={t("editor.chal_type")}>
                            <Select options={iteratePlugins("challengeType").map(({ key }) => ({ key, value: key }))}
                                initial={challenge.challenge_type || "default"}
                                name={"challenge_type"} />
                        </Form.Group>
                    </Card>
                    <Card lesser header={"Flag"} collapsible>
                        <Form.Group htmlFor={"flag_type"} label={t("editor.chal_flag_type")}>
                            <Select
                                options={iteratePlugins("flagType").map(
                                    ({ key, plugin: { name } }) => ({ key, value: name || key })
                                )}
                                initial={challenge.flag_type || "plaintext"}
                                name={"flag_type"} />
                        </Form.Group>
                        <FlagMetadata formRequires={["flag_type"]} name={"flag_metadata"}
                            val={challenge.flag_metadata} />
                        {/*
                        <Form.Group htmlFor={"flag_metadata"} label={t("editor.chal_flag")}>
                            <Input placeholder={t("editor.chal_flag")}
                                name={"flag_metadata"} monospace format={{
                                    test: i => { try { JSON.parse(i); return true; } catch (e) { return false; } }
                                }}
                                val={JSON.stringify(challenge.flag_metadata)} />
                            </Form.Group>*/}
                    </Card>
                    <Card lesser header={"Files"} collapsible startClosed={false}>
                        {isCreator
                            ? <Card slim danger>Cannot add files to non-existent challenge.</Card>
                            : <FileEditor challenge={challenge} />}
                    </Card>
                    <Card lesser header={"Hints"} collapsible startClosed>
                        {isCreator
                            ? <Card slim danger>Cannot add hints to non-existent challenge.</Card>
                            : <HintEditor challenge={challenge} />}
                    </Card>

                    <Container full toolbar>
                        {!isCreator && <Button onClick={removeChallenge} danger>{t("editor.remove")}</Button>}
                        <Button submit>{isCreator ? t("editor.create") : t("editor.save")}</Button>
                    </Container>
                </Column>
            </Container.Row>
        </Form>
    );
    if (embedded) return body;

    return <Page>
        <PageHead
            title={isCreator ? <>New challenge</> : <>Editing: {challenge.name}</>}
            back={<Link className={"backToChals"} to={category.url + "#edit"}>{t("back_to_chal")}</Link>}
        />
        {body}
    </Page>;
};
export default Editor;
