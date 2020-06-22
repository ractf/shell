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

import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import { useReactRouter } from "@ractf/util";

import {
    Button, Row, Input, Form, FormError, PageHead, Card, Link,
    FlashText, Leader, Modal, Page, H2
} from "@ractf/ui-kit";
import { editGroup, createGroup, quickRemoveChallenge, removeGroup } from "@ractf/api";
import { plugins, appContext } from "ractf";
import http from "@ractf/http";

import "./Campaign.scss";
import { useSelector } from "react-redux";

const ANC = ({ hide, anc, modal }) => {
    const app = useContext(appContext);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const create = ({ cname, cdesc, ctype }) => {
        if (!cname.length)
            return setError(t("challenge.no_name"));
        if (!ctype.length || !plugins.categoryType[ctype])
            return setError(t("challenge.invalid_cat") + Object.keys(plugins.categoryType).join(", "));

        setLocked(true);

        (anc.id ? editGroup(anc.id, cname, cdesc, ctype)
            : createGroup(cname, cdesc, ctype)).then(async resp => {
                if (hide)
                    hide();
            }).catch(e => {
                setError(http.getError(e));
                setLocked(false);
            });
    };
    const removeCategory = () => {
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
            app.alert("Something went wrong removing the category:\n" + http.getError(e));
        });
        hide();
    };

    const body = <Form locked={locked} handle={create}>
        {modal && <H2>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</H2>}
        <label htmlFor={"cname"}>{t("challenge.cat_name")}</label>
        <Input val={anc.name} name={"cname"} placeholder={t("challenge.cat_name")} />
        <label htmlFor={"cdesc"}>{t("challenge.cat_brief")}</label>
        <Input val={anc.description} name={"cdesc"} rows={5} placeholder={t("challenge.cat_brief")} />
        <label htmlFor={"ctype"}>{t("challenge.cat_type")}</label>
        <Input val={anc.contained_type} name={"ctype"} format={{ test: i => !!plugins.categoryType[i] }}
            placeholder={t("challenge.cat_type")} />
        {error && <FormError>{error}</FormError>}
        <Row>
            {anc.id &&
                <Button danger onClick={removeCategory}>{t("challenge.remove_cat")}</Button>
            }
            <Button submit>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</Button>
        </Row>
    </Form>;

    if (modal)
        return <Modal onHide={hide} title={t("challenge.new_chal")}>
            {body}
        </Modal>;
    return body;
};


const CategoryList = () => {
    const { t } = useTranslation();
    const categories = useSelector(state => state.challenges?.categories) || [];

    return <Page>
        <PageHead subTitle={t("categories.pick")} title={t("categories.all")} />
        <Row>
            {categories.map(i => {
                const solved = i.challenges.filter(j => j.solved).length;

                return <Leader key={i.id} link={"/campaign/" + i.id} green={solved === i.challenges.length}
                    sub={solved === i.challenges.length ? t("categories.finished") :
                        solved === 0 ? t("categories.none") :
                            t("categories.some", { count: i.challenges.length, total: solved })}>
                    {i.name}
                </Leader>;
            })}
        </Row>
    </Page>;
};


export default () => {
    const [anc, setAnc] = useState(false);
    const user = useSelector(state => state.user);
    const categories = useSelector(state => state.challenges?.categories) || [];
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const { location, match } = useReactRouter();
    const tabId = match.params.tabId;

    const edit = location.hash === "#edit" && user && user.is_staff;

    if (tabId === "new" && user.is_staff)
        return <Page>
            <Row>
                <Card header={t("challenge.new_cat")}>
                    <ANC anc={true} />
                </Card>
            </Row>
        </Page>;
    else if (!tabId) {
        return <CategoryList />;
    }

    const showEditor = (challenge) => {
        return () => {
            dispatch(push("/campaign/" + tabId + "/challenge/new#" + encodeURIComponent(JSON.stringify(challenge))));
        };
    };

    const tab = (() => {
        for (const i in categories)
            if (categories[i].id.toString() === tabId) return categories[i];
    })();
    let chalEl, challengeTab;

    if (!tab) {
        return <Redirect to={"/404"} />;
    }
    const handler = plugins.categoryType[tab.contained_type];
    if (!handler) {
        challengeTab = <>
            {t("challenge.cat_renderer_missing", { type: tab.contained_type })}<br /><br />
            {t("challenge.forgot_plugin")}
        </>;
    } else {
        challengeTab = React.createElement(
            handler.component, { challenges: tab, showEditor: showEditor, isEdit: edit }
        );
    }

    return <Page title={t("challenge_plural")}>
        {chalEl}
        {anc && <ANC modal anc={anc} hide={() => setAnc(false)} />}

        <PageHead subTitle={tab.description} back={<>
            <Link className={"backToChals"} to={"/campaign"}>{t("back_to_cat")}</Link>
        </>} title={tab.name} />
        {user.is_staff && <Row className={"campEdit"} right>
            {edit ? <>
                <Button key={"edD"} className={"campUnderEditButton"} onClick={() => setAnc(tab)}>
                    {t("edit_details")}
                </Button>
                <Button key={"edS"} className={"campEditButton"} to={"#"} danger>
                    {t("edit_stop")}
                </Button>
            </> : <Button key={"edE"} className={"campEditButton"} to={"#edit"} danger>
                    {t("edit")}
                </Button>}
        </Row>}
        {!user.team && <FlashText danger>{t("campaign.no_team")}</FlashText>}
        <div className={"campInner"}>{challengeTab}</div>
    </Page>;
};
