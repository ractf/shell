import React, { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import { SectionTitle2 } from "../../components/Misc";
import useReactRouter from "../../useReactRouter";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import {
    plugins, Button, FlexRow, apiContext, apiEndpoints, Input, Form,
    FormError, SBTSection, Section, appContext, Link, FlashText, Leader
} from "ractf";

import "./Campaign.scss";

const ANC = ({ hide, anc, modal }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");
    const { history } = useReactRouter();
    const { t } = useTranslation();

    const create = ({ cname, cdesc, ctype }) => {
        if (!cname.length)
            return setError(t("challenge.no_name"));
        if (!ctype.length || !plugins.categoryType[ctype])
            return setError(t("challenge.invalid_cat") + Object.keys(plugins.categoryType).join(", "));

        setLocked(true);

        (anc.id ? endpoints.editGroup(anc.id, cname, cdesc, ctype)
            : endpoints.createGroup(cname, cdesc, ctype)).then(async resp => {
                await endpoints.setup(true);
                if (hide)
                    hide();
            }).catch(e => {
                setError(endpoints.getError(e));
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
                return endpoints.removeChallenge(i, true).then(() => {
                    progress += 1 / anc.challenges.length;
                    app.showProgress("Removing challenges...", progress);
                });
            }));
            app.showProgress("Removing category...", .5);
            await endpoints.removeGroup(anc.id);
            history.push("/campaign");
            app.alert("Category removed!");
        }).catch(e => {
            app.alert("Something went wrong removing the category:\n" + endpoints.getError(e));
        });
        hide();
    };

    let body = <Form locked={locked} handle={create}>
        {modal && <SectionTitle2>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</SectionTitle2>}
        <label htmlFor={"cname"}>{t("challenge.cat_name")}</label>
        <Input val={anc.name} name={"cname"} placeholder={t("challenge.cat_name")} />
        <label htmlFor={"cdesc"}>{t("challenge.cat_brief")}</label>
        <Input val={anc.description} name={"cdesc"} rows={5} placeholder={t("challenge.cat_brief")} />
        <label htmlFor={"ctype"}>{t("challenge.cat_type")}</label>
        <Input val={anc.contained_type} name={"ctype"} format={{ test: i => !!plugins.categoryType[i] }}
            placeholder={t("challenge.cat_type")} />
        {error && <FormError>{error}</FormError>}
        <FlexRow>
            {anc.id &&
                <Button warning click={removeCategory}>{t("challenge.remove_cat")}</Button>
            }
            <Button submit>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</Button>
        </FlexRow>
    </Form>;

    if (modal)
        return <Modal onHide={hide} title={t("challenge.new_chal")}>
            {body}
        </Modal>;
    return body;
};


const CategoryList = () => {
    const api = useContext(apiContext);
    const { t } = useTranslation();

    return <Page>
        <SBTSection subTitle={t("categories.pick")} title={t("categories.all")}>
            {api.challenges.map(i => {
                let solved = i.challenges.filter(j => j.solved).length;

                return <Leader key={i.id} link={"/campaign/" + i.id} green={solved === i.challenges.length}
                    sub={solved === i.challenges.length ? t("categories.finished") :
                        solved === 0 ? t("categories.none") :
                            t("categories.some", { count: i.challenges.length, total: solved })}>
                    {i.name}
                </Leader>;
            })}
        </SBTSection>
    </Page>;
};


export default () => {
    const [anc, setAnc] = useState(false);

    const { t } = useTranslation();
    const { history, location, match } = useReactRouter();
    const tabId = match.params.tabId;

    const api = useContext(apiContext);

    const edit = location.hash === "#edit" && api.user && api.user.is_staff;

    if (tabId === "new" && api.user.is_staff)
        return <Page><SBTSection key={"anc"} title={t("challenge.new_cat")} noHead>
            <Section title={t("challenge.new_cat")}>
                <ANC anc={true} />
            </Section>
        </SBTSection></Page>;
    else if (!tabId) {
        return <CategoryList />;
    }

    const showEditor = (challenge) => {
        return () => {
            history.push("/campaign/" + tabId + "/challenge/new#" + encodeURIComponent(JSON.stringify(challenge)));
        };
    };

    if (!api.challenges)
        api.challenges = [];

    let tab = (() => {
        for (let i in api.challenges)
            if (api.challenges[i].id.toString() === tabId) return api.challenges[i];
    })();
    let chalEl, handler, challengeTab;

    if (!tab) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />;
    }
    handler = plugins.categoryType[tab.contained_type];
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

        <SBTSection key={tab.id} subTitle={tab.description} back={<>
            <Link className={"backToChals"} to={"/campaign"}>{t("back_to_cat")}</Link>
        </>} title={tab.name}>
            {api.user.is_staff && <FlexRow className={"campEdit"}>
                {edit ? <>
                    <Button key={"edD"} className={"campUnderEditButton"} click={() => setAnc(tab)}>
                        {t("edit_details")}
                    </Button>
                    <Button key={"edS"} className={"campEditButton"} to={"#"} warning>
                        {t("edit_stop")}
                    </Button>
                </> : <Button key={"edE"} className={"campEditButton"} to={"#edit"} warning>
                        {t("edit")}
                    </Button>}
            </FlexRow>}
            {edit && <Button className={"campUnderEditButton"} click={() => setAnc(tab)}>{t("edit_details")}</Button>}
            {!api.user.team && <FlashText warning>{t("campaign.no_team")}</FlashText>}
            <div className={"campInner"}>{challengeTab}</div>
        </SBTSection>
    </Page>;
};
