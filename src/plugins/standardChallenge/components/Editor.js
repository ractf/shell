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

import React, { useContext, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import {
    Form, Input, Row, Checkbox, Button, Select, PageHead, InputTags,
    FormGroup, fromJson, Page, Column, Card, Grid, Modal,
    FileUpload, TabbedView, Tab, SubtleText
} from "@ractf/ui-kit";
import { NUMBER_RE, formatBytes } from "@ractf/util";
import { iteratePlugins, getPlugin } from "@ractf/plugins";
import { newHint } from "@ractf/api";
import { appContext } from "ractf";
import * as actions from "actions";
import * as http from "@ractf/util/http";
import Link from "components/Link";

import File from "./File";
import Hint from "./Hint";
import { useRef } from "react";


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
        <Row>
            <Button submit>Save Edit</Button>
        </Row>
    </Form></div>;
};

const HintEditor = ({ challenge }) => {
    const app = useContext(appContext);

    const addHint = useCallback(() => {
        app.promptConfirm({ message: "New hint" },
            [{ name: "name", placeholder: "Hint name", label: "Name" },
            { name: "cost", placeholder: "Hint cost", label: "Cost", format: NUMBER_RE },
            { name: "body", placeholder: "Hint text", label: "Message", rows: 5 }]
        ).then(({ name, cost, body }) => {
            if (!cost.match(NUMBER_RE)) return app.alert("Invalid hint cost!");

            newHint(challenge.id, name, cost, body).then(() =>
                app.alert("New hint added!")
            ).catch(e =>
                app.alert("Error creating new hint:\n" + http.getError(e))
            );
        });
    }, [app, challenge.id]);

    return <>
        <Row>
            <Grid headings={["Name", "Cost", "Message", "Actions"]} data={challenge.hints.map(hint => [
                hint.name, hint.penalty, hint.text.length > 100 ? hint.text.substring(0, 100) + "\u2026" : hint.text,
                <Hint key={hint.id} {...hint} isEdit />
            ])} />
        </Row>
        <Row>
            <Button onClick={addHint}>Add Hint</Button>
        </Row>
    </>;
};

const FileEditor = ({ challenge }) => {
    const app = useContext(appContext);
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
        app.alert("New file added");
    }, [dispatch, challenge.id, app]);
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

        app.showProgress(
            `Uploaded ${formatBytes(event.loaded, 1)}/${formatBytes(event.total, 1)}`
            + (speed !== null ? ` (${formatBytes(speed, 1)}/s)` : ""),
            event.loaded / event.total
        );
    }, [app]);
    const uploadFailed = useCallback(({ error }) => {
        app.alert("Upload failed: " + http.getError(error));
    }, [app]);
    const validator = useCallback(({ upload }) => {
        return new Promise((resolve, reject) => {
            const size = formatBytes(upload.size, 1);
            if (upload.size > SUPPORTED_FILE_SIZE)
                app.promptConfirm({
                    message: `You are about to upload a file larger than officially supported (${size}). `
                        + "Are you sure you wish to proceed?",
                    small: true,
                    okay: "Abort",
                    cancel: "Proceed",
                }).catch(clickedButton => clickedButton ? resolve() : reject()).then(reject);
            else if (upload.size > LARGE_FILE_SIZE)
                app.promptConfirm({
                    message: `You are about to upload a large file (${size}). `
                        + "Are you sure you wish to proceed?",
                    small: true,
                    okay: "Abort",
                    cancel: "Proceed",
                }).catch(clickedButton => clickedButton ? resolve() : reject()).then(reject);
            else resolve();
        });
    }, [app]);

    const modal = <Modal header={"New file"} onClose={onClose} onConfirm={modalSubmit}
        okay={activeTab === "upload" ? "Upload File" : "Add File"}>
        <TabbedView active={activeTab} setActive={setActiveTab} neverUnmount>
            <Tab label={"Upload File"} index={"upload"}>
                <Form multipart method={"POST"} action={"/challenges/files/"}
                    postSubmit={postSubmit} submitRef={submitUpRef} onUploadProgress={onUploadProgress}
                    onError={uploadFailed} validator={validator}>
                    <Input hidden val={challenge.id} name={"challenge"} />
                    <FormGroup label={"Choose file"} htmlFor={"upload"}>
                        <FileUpload required name={"upload"} globalDrag />
                        <label><SubtleText>
                            Uploading files larger than {formatBytes(SUPPORTED_FILE_SIZE)} is not
                            officially supported. You may wish to instead upload files this large
                            to an alternative hosting provider and link the file instead.
                        </SubtleText></label>
                    </FormGroup>
                </Form>
            </Tab>
            <Tab label={"Link File"} index={"link"}>
                <Form multipart method={"POST"} action={"/challenges/files/"}
                    postSubmit={postSubmit} submitRef={submitAddRef} >
                    <FormGroup label={"File name"} htmlFor={"name"}>
                        <Input required name={"name"} placeholder={"File name"} />
                    </FormGroup>
                    <FormGroup label={"File URL"} htmlFor={"url"}>
                        <Input required name={"url"} placeholder={"File URL"} />
                    </FormGroup>
                    <FormGroup label={"File size (in bytes)"} htmlFor={"size"}>
                        <Input required name={"size"} placeholder={"File Size"} format={/\d+/} />
                    </FormGroup>
                    <Input hidden val={challenge.id} name={"challenge"} />
                </Form>
            </Tab>
        </TabbedView>
    </Modal>;

    return <>
        {modalOpen && modal}
        <Row>
            <Grid headings={["Name", "URL", "Size", "Actions"]} data={challenge.files.map(file => [
                file.name, <Link to={file.url}>{file.url}</Link>, file.size,
                <File key={file.id} {...file} isEdit />
            ])} />
        </Row>
        <Row>
            <Button onClick={addFile}>Add File</Button>
        </Row>
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

const Editor = ({ challenge, category, isCreator, saveEdit, removeChallenge, embedded }) => {
    const { t } = useTranslation();

    const editTransformer = useCallback((data) => {
        return { ...data, tags: data.tags ? data.tags.map(i => ({ type: "tag", text: i })) : [] };
    }, []);

    const allChallenges = category.challenges.filter(j => j.id !== challenge.id).map(j => j.name);

    const body = (
        <Form handle={saveEdit} transformer={editTransformer}>
            <Row left>
                <Column lgWidth={6} mdWidth={12}>
                    <FormGroup label={"Unlock Requirements"} htmlFor={"name"}>
                        <InputTags name={"Test"} limit={allChallenges} val={["The", "quick", "brow", "fox"]} />
                    </FormGroup>

                    <Card lesser header={"Basic settings"} collapsible>
                        <FormGroup htmlFor={"name"} label={t("editor.chal_name")}>
                            <Input val={challenge.name} name={"name"} placeholder={t("editor.chal_name")} required />
                        </FormGroup>
                        <FormGroup htmlFor={"score"} label={t("editor.chal_points")}>
                            <Input val={challenge.score !== undefined ? challenge.score.toString() : undefined}
                                name={"score"} placeholder={t("editor.chal_points")} format={NUMBER_RE} required />
                        </FormGroup>
                        <FormGroup htmlFor={"author"} label={t("editor.chal_author")}>
                            <Input val={challenge.author} name={"author"} placeholder={t("editor.chal_author")}
                                required />
                        </FormGroup>
                        <FormGroup htmlFor={"description"} label={t("editor.chal_brief")}>
                            <Input rows={5} val={challenge.description} name={"description"}
                                placeholder={t("editor.chal_brief")} required />
                        </FormGroup>
                        <FormGroup htmlFor={"tags"} label={t("editor.tags")}>
                            <InputTags name={"tags"} val={challenge.tags} />
                        </FormGroup>
                    </Card>
                    <Card lesser header={"Advanced settings"} collapsible startClosed>
                        <FormGroup htmlFor={"post_score_explanation"} label={t("editor.post_score_explanation")}>
                            <Input rows={3} val={challenge.post_score_explanation} name={"post_score_explanation"}
                                placeholder={t("editor.post_score_explanation")} />
                        </FormGroup>
                    </Card>
                    <Card lesser header={"Metadata"} collapsible startClosed>
                        <MetadataEditor category={category} challenge={challenge} save={saveEdit} />
                    </Card>
                </Column>
                <Column lgWidth={6} mdWidth={12}>
                    <Card lesser header={"Display settings"} collapsible>
                        <Row>
                            <Checkbox val={!!challenge.hidden} name={"hidden"}>
                                {t("editor.hide_challenge")}
                            </Checkbox>
                            <Checkbox val={isCreator || !!challenge.auto_unlock} name={"auto_unlock"}>
                                {t("editor.auto_unlock")}
                            </Checkbox>
                        </Row>

                        <FormGroup htmlFor={"challenge_type"} label={t("editor.chal_type")}>
                            <Select options={iteratePlugins("challengeType").map(({ key }) => ({ key, value: key }))}
                                initial={challenge.challenge_type || "default"}
                                name={"challenge_type"} />
                        </FormGroup>
                    </Card>
                    <Card lesser header={"Flag"} collapsible>
                        <FormGroup htmlFor={"flag_type"} label={t("editor.chal_flag_type")}>
                            <Select
                                options={iteratePlugins("flagType").map(
                                    ({ key, plugin: { name } }) => ({ key, value: name || key })
                                )}
                                initial={challenge.flag_type || "plaintext"}
                                name={"flag_type"} />
                        </FormGroup>
                        <FlagMetadata formRequires={["flag_type"]} name={"flag_metadata"}
                            val={challenge.flag_metadata} />
                        {/*
                        <FormGroup htmlFor={"flag_metadata"} label={t("editor.chal_flag")}>
                            <Input placeholder={t("editor.chal_flag")}
                                name={"flag_metadata"} monospace format={{
                                    test: i => { try { JSON.parse(i); return true; } catch (e) { return false; } }
                                }}
                                val={JSON.stringify(challenge.flag_metadata)} />
                            </FormGroup>*/}
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

                    <Row>
                        {!isCreator && <Button onClick={removeChallenge} danger>{t("editor.remove")}</Button>}
                        <Button submit>{isCreator ? t("editor.create") : t("editor.save")}</Button>
                    </Row>
                </Column>
            </Row>
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
