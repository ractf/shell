import React, { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import { SectionTitle2 } from "../../components/Misc";
import useReactRouter from "../../useReactRouter";
import Modal from "../../components/Modal";
import Page from "./bases/Page";

import {
    plugins, Button, ButtonRow, apiContext, apiEndpoints, Input, Form,
    FormError, SBTSection, Section, appContext
} from "ractf";

import "./Campaign.scss";


const ANC = ({ hide, anc, modal }) => {
    const endpoints = useContext(apiEndpoints);
    const [locked, setLocked] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const create = ({ cname, cdesc, ctype }) => {
        if (!cname.length)
            return setError(t("challenge.no_name"));
        if (!ctype.length || !plugins.categoryType[ctype])
            return setError(t("challenge.invalid_cat") + Object.keys(plugins.categoryType).join(", "));

        setLocked(true);

        (anc.id ? endpoints.editGroup(anc.id, cname, cdesc, ctype)
            : endpoints.createGroup(cname, cdesc, ctype)).then(async resp => {
                await endpoints.setup();
                if (hide)
                    hide();
            }).catch(e => {
                setError(endpoints.getError(e));
                setLocked(false);
            });
    };

    let body = <Form locked={locked} handle={create}>
        {modal && <SectionTitle2>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</SectionTitle2>}
        <label htmlFor={"cname"}>{t("challenge.cat_name")}</label>
        <Input val={anc.name} name={"cname"} placeholder={t("challenge.cat_name")} />
        <label htmlFor={"cdesc"}>{t("challenge.cat_brief")}</label>
        <Input val={anc.desc} name={"cdesc"} rows={5} placeholder={t("challenge.cat_brief")} />
        <label htmlFor={"ctype"}>{t("challenge.cat_type")}</label>
        <Input val={anc.type} name={"ctype"} format={{ test: i => !!plugins.categoryType[i] }}
            placeholder={t("challenge.cat_type")} />
        {error && <FormError>{error}</FormError>}
        <ButtonRow>
            {anc.id &&
                <Button warning disabled>{t("challenge.remove_cat")}</Button>
            }
            <Button submit>{anc.id ? t("challenge.edit_cat") : t("challenge.new_cat")}</Button>
        </ButtonRow>
    </Form>;

    if (modal)
        return <Modal onHide={hide} title={t("challenge.new_chal")}>
            {body}
        </Modal>;
    return body;
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

    if (tabId === "new" && api.user.is_admin)
        return <SBTSection key={"anc"} title={t("challenge.new_cat")} noHead>
            <Section light title={t("challenge.new_cat")}>
                <ANC anc={true} />
            </Section>
        </SBTSection>;
    else if (!tabId)
        return <Redirect to={"/campaign/" + api.challenges[0].id} />;

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
                flag = JSON.parse(changes.flag);
            } catch (e) {
                if (!changes.flag.length) flag = "";
                else return app.alert(t("challenge.invalid_flag_json"));
            }

            (isCreator ? endpoints.createChallenge : endpoints.editChallenge)(
                (isCreator ? tabId : original.id),
                changes.name, changes.points, changes.desc, changes.flag_type, flag,
                changes.autoUnlock, original.metadata
            ).then(async () => {
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

    if (!api.challenges)
        api.challenges = [];

    let tab = (() => {
        for (let i in api.challenges)
            if (api.challenges[i].id === tabId) return api.challenges[i];
    })();
    let chalEl, handler, challengeTab;

    if (!tab) {
        if (!api.challenges || !api.challenges.length) return <></>;
        return <Redirect to={"/404"} />;
    }
    handler = plugins.categoryType[tab.type];
    if (!handler) {
        challengeTab = <>
            {t("challenge.cat_renderer_missing", {type: tab.type})}<br /><br />
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
            handler = plugins.challengeType["__default"];

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
                isCreator: isCreator,
            });
        }

        chalEl = <Modal onHide={hideChal}>
            {chalEl}
        </Modal>;
    }

    return <Page title={t("challenge_plural")}>
        {chalEl}
        {anc && <ANC modal anc={anc} hide={() => setAnc(false)} />}

        <SBTSection key={tab.id} subTitle={tab.desc} title={tab.name}>
            {api.user.is_admin ? edit ?
                <Button className={"campEditButton"} click={() => { setEdit(false); }} warning>{t("edit_stop")}</Button>
                : <Button className={"campEditButton"} click={() => { setEdit(true); }} warning>
                    {t("edit")}
                </Button> : null}
            {edit && <Button className={"campUnderEditButton"} click={() => setAnc(tab)}>{t("edit_save")}</Button>}

            <div className={"campInner"}>{challengeTab}</div>
        </SBTSection>
    </Page>;
};
