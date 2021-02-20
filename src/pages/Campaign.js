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

import React, { useState, useRef, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import { useReactRouter } from "@ractf/util";
import { useCategory, useCategories, usePreference } from "@ractf/util/hooks";

import {
    Button, Row, Input, Form, FormError, PageHead, Card, Modal,
    Page, TabbedView, Tab, fromJson, Select, FormGroup, Masonry
} from "@ractf/ui-kit";
import { editGroup, createGroup, quickRemoveChallenge, removeGroup } from "@ractf/api";
import { getClass, getPlugin, iteratePlugins, PluginComponent } from "@ractf/plugins";
import Category from "@ractf/util/category";
import { appContext } from "ractf";
import * as http from "@ractf/util/http";
import Link from "components/Link";

import "./Campaign.scss";
import { useSelector } from "react-redux";

const ANC = ({ hide, anc, modal }) => {
    const app = useContext(appContext);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const submit = useRef();
    const metadataRef = useRef();

    const create = useCallback(({ cname, cdesc, ctype }) => {
        if (!cname.length)
            return setError(t("challenge.no_name"));
        if (!ctype.length || !getPlugin("categoryType", ctype))
            return setError(
                t("challenge.invalid_cat") + iteratePlugins("categoryType").map(({ key }) => key).join(", "))
                ;

        setLocked(true);

        (anc.id ? editGroup(anc.id, cname, cdesc, ctype, metadataRef.current)
            : createGroup(cname, cdesc, ctype)).then(async resp => {
                if (hide)
                    hide();
                app.alert(t(anc.id ? "campaign.edit_success" : "campaign.create_success"));
                if (!anc.id) {
                    // Redirect to newly created category
                    const created = getClass(Category).fromJSON(resp);
                    dispatch(push(created.url));
                }
            }).catch(e => {
                setError(http.getError(e));
                setLocked(false);
            });
    }, [anc, app, hide, t, dispatch]);
    const removeCategory = useCallback(() => {
        app.promptConfirm({
            message: "Are you sure you want to remove the category:\n" + anc.name,
            small: true
        }).then(async () => {
            app.showProgress("Removing challenges...", 0);
            let progress = 0;
            await Promise.all(anc.challenges.map(i => {
                return quickRemoveChallenge(i).then(() => {
                    progress += 1 / anc.challenges.length;
                    app.showProgress("Removing challenges...", progress);
                });
            }));
            app.showProgress("Removing category...", .5);
            await removeGroup(anc.id);
            dispatch(push("/campaign"));
            app.alert("Category removed!");
        }).catch(e => {
            console.error(e);
            app.alert("Something went wrong removing the category:\n" + http.getError(e));
        });
        hide();
    }, [anc, app, dispatch, hide]);

    const body = <TabbedView neverUnmount>
        <Tab label={t("editor.cat_settings")}>
            <Form locked={locked} handle={create} submitRef={submit}>
                <FormGroup htmlFor={"cname"} label={t("challenge.cat_name")}>
                    <Input val={anc.name} name={"cname"} placeholder={t("challenge.cat_name")} />
                </FormGroup>
                <FormGroup htmlFor={"cdesc"} label={t("challenge.cat_brief")}>
                    <Input val={anc.description} name={"cdesc"} rows={5} placeholder={t("challenge.cat_brief")} />
                </FormGroup>
                <FormGroup htmlFor={"ctype"} label={t("challenge.cat_type")}>
                    <Select options={iteratePlugins("categoryType").map(({ key }) => ({ key, value: key }))}
                        initial={anc.contained_type} name={"ctype"} />
                </FormGroup>

                {error && <FormError>{error}</FormError>}
                {!modal && (
                    <Row>
                        {anc.id &&
                            <Button danger onClick={removeCategory}>{t("challenge.remove_cat")}</Button>
                        }
                        <Button submit>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</Button>
                    </Row>
                )}
            </Form>
        </Tab>
        <Tab label={t("editor.metadata")}>
            <Form locked={locked} valuesRef={metadataRef}>
                {iteratePlugins("categoryMetadata").map(({ plugin }) => fromJson(plugin.fields, anc.metadata))}
            </Form>
        </Tab>
    </TabbedView>;
    const doSubmit = useCallback(() => {
        submit.current();
    }, []);

    if (modal)
        return <Modal onClose={hide} header={anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")} buttons={<>
            <Button lesser danger onClick={removeCategory}>{t("challenge.remove_cat")}</Button>
            <div style={{ flexGrow: 1 }} />
            <Button onClick={hide}>{t("cancel")}</Button>
            <Button onClick={doSubmit}>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</Button>
        </>} okay={false} cancel={false}>
            {body}
        </Modal>;
    return body;
};


const CategoryList = () => {
    const { t } = useTranslation();
    const categories = useCategories();

    return <Page>
        <PageHead subTitle={t("categories.pick")} title={t("categories.all")} />
        <Masonry>
            {categories.map(i => {
                const solved = i.challenges.filter(j => j.solved).length;

                return (<Link to={i.url}>
                    <Card key={i.id} lesser
                        success={solved === i.challenges.length}
                        subtitle={solved === i.challenges.length ? t("categories.finished") :
                            solved === 0 ? t("categories.none") :
                                t("categories.some", { count: i.challenges.length, total: solved })}
                        header={i.name}
                    >
                        {i.description}
                    </Card>
                </Link>);
            })}
        </Masonry>
    </Page>;
};


export default () => {
    const [anc, setAnc] = useState(false);
    const [showLocked, setShowLocked] = usePreference("editor.show_locked");
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const { location, match } = useReactRouter();
    const tabId = match.params.tabId;
    const tab = useCategory(tabId);

    const edit = location.hash === "#edit" && user && user.is_staff;

    if (tabId === "new" && user.is_staff)
        return <Page>
            <Row>
                <Card lesser header={t("challenge.new_cat")}>
                    <ANC anc={true} />
                </Card>
            </Row>
        </Page>;
    else if (!tabId) {
        return <CategoryList />;
    }

    const toggleShowLocked = () => {
        setShowLocked(oldShowLocked => !oldShowLocked);
    };

    const showEditor = (challenge) => {
        return () => {
            dispatch(push(challenge.category.url + "/new#" + encodeURIComponent(JSON.stringify(challenge))));
        };
    };

    if (!tab) {
        return <Redirect to={"/404"} />;
    }

    return <Page title={t("challenge_plural")}>
        {anc && <ANC modal anc={anc} hide={() => setAnc(false)} />}

        <PageHead subTitle={tab.description} back={<>
            <Link className={"backToChals"} to={"/campaign"}>{t("back_to_cat")}</Link>
        </>} title={tab.name} />
        {user.is_staff && <Row className={"campEdit"} right>
            {edit ? <>
                <Button key={"edD"} onClick={() => setAnc(tab)}>
                    {t("edit_details")}
                </Button>
                <Link to={"#"}>
                    <Button key={"edS"} danger lesser>
                        {t("edit_stop")}
                    </Button>
                </Link>
            </> : <>
                    <Button key={"edAll"} onClick={toggleShowLocked} lesser={!showLocked}>
                        {showLocked ? t("editor.hide_locked") : t("editor.show_locked")}
                    </Button>
                    <Link to={"#edit"}>
                        <Button key={"edE"} danger lesser>
                            {t("edit")}
                        </Button>
                    </Link>
                </>}
        </Row>}
        {!user.team && (
            <Row>
                <Card slim danger>{t("campaign.no_team")}</Card>
            </Row>
        )}
        <PluginComponent type={"categoryType"} name={tab.contained_type} challenges={tab}
            showEditor={showEditor} isEdit={edit} showLocked={showLocked} />
    </Page>;
};
