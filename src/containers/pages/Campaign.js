import React, { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import { SectionTitle2 } from "../../components/Misc";
import useReactRouter from "../../useReactRouter";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import {
    plugins, Button, FlexRow, apiContext, apiEndpoints, Input, Form,
    FormError, SBTSection, Section, appContext, Link
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
                return <Link key={i.id} to={"/campaign/" + i.id}
                             className={"catList" + (solved === i.challenges.length ? " catDone" : "")}>
                    <div className={"catName"}>{i.name}</div>
                    <div className={"catStat"}>{
                        solved === i.challenges.length ? t("categories.finished") :
                        solved === 0 ? t("categories.none") :
                        t("categories.some", {count: i.challenges.length, total: solved})
                    }</div>
                </Link>;
            })}
        </SBTSection>
    </Page>;
};


export default () => {
    const [challenge, setChallenge] = useState(null);
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [lState, setLState] = useState({});
    const [anc, setAnc] = useState(false);

    const { t } = useTranslation();
    const { match } = useReactRouter();
    const tabId = match.params.tabId;

    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const api = useContext(apiContext);

    if (tabId === "new" && api.user.is_staff)
        return <Page><SBTSection key={"anc"} title={t("challenge.new_cat")} noHead>
            <Section title={t("challenge.new_cat")}>
                <ANC anc={true} />
            </Section>
        </SBTSection></Page>;
    else if (!tabId) {
        return <CategoryList />;
    }

    const showEditor = (challenge, saveTo, isNew) => {
        return () => {
            setChallenge(challenge || {});
            setLState({
                saveTo: saveTo
            });
            setIsEditor(true);
            setIsCreator(!!isNew);
        };
    };

    const hideChal = () => {
        setChallenge(null);
        setIsEditor(false);
    };

    const saveEdit = (original) => {
        return changes => {
            let flag;
            try {
                flag = JSON.parse(changes.flag_metadata);
            } catch (e) {
                if (!changes.flag_metadata.length) flag = "";
                else return app.alert(t("challenge.invalid_flag_json"));
            }

            (isCreator ? endpoints.createChallenge : endpoints.editChallenge)({
                ...original, ...changes, id: (isCreator ? tabId : original.id), flag_metadata: flag
            }).then(async () => {
                for (let i in changes)
                    original[i] = changes[i];
                if (lState.saveTo)
                    lState.saveTo.push(original);

                await endpoints.setup();
                setIsEditor(false);
                setChallenge(null);
            }).catch(e => app.alert(endpoints.getError(e)));
        };
    };

    const removeChallenge = (challenge) => {
        return () => {
            app.promptConfirm({message: "Remove challenge:\n" + challenge.name, small: true}).then(() => {
                endpoints.removeChallenge(challenge).then(() => {
                    app.alert("Challenge removed");
                    setIsEditor(false);
                    setChallenge(null);
                }).catch(e => {
                    app.alert("Error removing challenge:\n" + endpoints.getError(e));
                });
            }).catch(() => { });
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
            {t("challenge.cat_renderer_missing", {type: tab.contained_type})}<br /><br />
            {t("challenge.forgot_plugin")}
        </>;
    } else {
        challengeTab = React.createElement(
            handler.component, { challenges: tab, showEditor: showEditor, isEdit: edit }
        );
    }

    if (challenge || isEditor) {
        if (challenge.type)
            handler = plugins.challengeType[challenge.type];
        else
            handler = plugins.challengeType["default"];

        if (!handler)
            chalEl = <>
                {t("challenge.renderer_missing", {type: challenge.type})}<br /><br />
                {t("challenge.forgot_plugin")}
            </>;
        else {
            chalEl = React.createElement(
                handler.component, {
                challenge: challenge, doHide: hideChal,
                isEditor: isEditor, saveEdit: saveEdit,
                removeChallenge: removeChallenge(challenge),
                isCreator: isCreator,
                category: tab,
            });
        }

        chalEl = <Modal onHide={hideChal}>
            {chalEl}
        </Modal>;
    }

    return <Page title={t("challenge_plural")}>
        {chalEl}
        {anc && <ANC modal anc={anc} hide={() => setAnc(false)} />}

        <SBTSection key={tab.id} subTitle={tab.description} title={tab.name}>
            {api.user.is_staff ? edit ?
                <Button className={"campEditButton"} click={() => { setEdit(false); endpoints.setup(true); }} warning>
                    {t("edit_stop")}
                </Button> : <Button className={"campEditButton"} click={() => { setEdit(true); }} warning>
                    {t("edit")}
                </Button> : null}
            {edit && <Button className={"campUnderEditButton"} click={() => setAnc(tab)}>{t("edit_details")}</Button>}
            <Link className={"backToChals"} to={"/campaign"}>{t("back_to_cat")}</Link>
            <div className={"campInner"}>{challengeTab}</div>
        </SBTSection>
    </Page>;
};
