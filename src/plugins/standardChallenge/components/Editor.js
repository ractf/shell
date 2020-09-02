// Copyright (C) 2020 Really Awesome Technology Ltd
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

import React, { useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
    Form, Input, Row, Checkbox, Button, Select, PageHead, Link, InputTags,
    FlashText, FormGroup, fromJson, Page, Column, Card, Grid
} from "@ractf/ui-kit";
import { iteratePlugins, getPlugin } from "@ractf/plugins";
import { newHint, newFile } from "@ractf/api";
import { appContext } from "ractf";
import { NUMBER_RE } from "@ractf/util";
import http from "@ractf/http";

import File from "./File";
import Hint from "./Hint";


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

            if (!cost.match(NUMBER_RE)) return app.alert("Invalid file size!");

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
                <Hint key={hint.id} points={hint.penalty} name={hint.name} id={hint.id} body={hint.text} isEdit />
            ])} />
        </Row>
        <Row>
            <Button onClick={addHint}>Add Hint</Button>
        </Row>
    </>;
};

const FileEditor = ({ challenge }) => {
    const app = useContext(appContext);

    const addFile = useCallback(() => {
        app.promptConfirm({ message: "New file", },
            [{ name: "name", placeholder: "File name", label: "Name" },
            { name: "url", placeholder: "File URL", label: "URL" },
            { name: "size", placeholder: "File size", label: "Size (bytes)", format: NUMBER_RE }]
        ).then(({ name, url, size }) => {
            if (!size.match(NUMBER_RE)) return app.alert("Invalid file size!");

            newFile(challenge.id, name, url, size).then((id) => {
                app.alert("New file added!");
            }).catch(e =>
                app.alert("Error creating new file:\n" + http.getError(e))
            );
        });
    }, [app, challenge.id]);

    return <>
        <Row>
            <Grid headings={["Name", "URL", "Size", "Actions"]} data={challenge.files.map(file => [
                file.name, <Link to={file.url}>{file.url}</Link>, file.size,
                <File key={file.id} name={file.name} url={file.url} id={file.id} size={file.size} isEdit />
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
        return { ...data, tags: data.tags.map(i => ({ type: "tag", text: i })) };
    }, []);

    const body = (
        <Form handle={saveEdit} transformer={editTransformer}>
            <Row left>
                <Column lgWidth={6} mdWidth={12}>
                    <Card header={"Basic settings"} collapsible>
                        <FormGroup htmlFor={"name"} label={t("editor.chal_name")}>
                            <Input val={challenge.name} name={"name"} placeholder={t("editor.chal_name")} />
                        </FormGroup>
                        <FormGroup htmlFor={"score"} label={t("editor.chal_points")}>
                            <Input val={challenge.score !== undefined ? challenge.score.toString() : undefined}
                                name={"score"} placeholder={t("editor.chal_points")} format={NUMBER_RE} />
                        </FormGroup>
                        <FormGroup htmlFor={"author"} label={t("editor.chal_author")}>
                            <Input val={challenge.author} name={"author"} placeholder={t("editor.chal_author")} />
                        </FormGroup>
                        <FormGroup htmlFor={"description"} label={t("editor.chal_brief")}>
                            <Input rows={5} val={challenge.description} name={"description"}
                                placeholder={t("editor.chal_brief")} />
                        </FormGroup>
                        <FormGroup htmlFor={"tags"} label={t("editor.tags")}>
                            <InputTags name={"tags"} val={challenge.tags} />
                        </FormGroup>
                    </Card>
                    <Card header={"Advanced settings"} collapsible startClosed>
                        <FormGroup htmlFor={"post_score_explanation"} label={t("editor.post_score_explanation")}>
                            <Input rows={3} val={challenge.post_score_explanation} name={"post_score_explanation"}
                                placeholder={t("editor.post_score_explanation")} />
                        </FormGroup>
                    </Card>
                    <Card header={"Metadata"} collapsible startClosed>
                        <MetadataEditor category={category} challenge={challenge} save={saveEdit} />
                    </Card>
                </Column>
                <Column lgWidth={6} mdWidth={12}>
                    <Card header={"Display settings"} collapsible>
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
                                initial={
                                    iteratePlugins("challengeType")
                                        .map(i => i.key)
                                        .indexOf(challenge.challenge_type || "default")
                                }
                                name={"challenge_type"} />
                        </FormGroup>
                    </Card>
                    <Card header={"Flag"} collapsible>
                        <FormGroup htmlFor={"flag_type"} label={t("editor.chal_flag_type")}>
                            <Select
                                options={iteratePlugins("flagType").map(
                                    ({ key, plugin: { name } }) => ({ key, value: name || key })
                                )}
                                initial={
                                    iteratePlugins("flagType")
                                        .map(i => i.key)
                                        .indexOf(challenge.flag_type || "plaintext")
                                }
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
                    <Card header={"Files"} collapsible startClosed>
                        {isCreator
                            ? <FlashText danger>Cannot add files to non-existent challenge.</FlashText>
                            : <FileEditor challenge={challenge} />}
                    </Card>
                    <Card header={"Hints"} collapsible startClosed>
                        {isCreator
                            ? <FlashText danger>Cannot add hints to non-existent challenge.</FlashText>
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
            back={<Link className={"backToChals"} to={"..#edit"}>{t("back_to_chal")}</Link>}
        />
        {body}
    </Page>;
};
export default Editor;
