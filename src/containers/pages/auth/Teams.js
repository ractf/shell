import React, { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";

import {
    apiContext, apiEndpoints, Form, FormError, Page, SectionTitle2, HR, Input,
    Button, FlexRow, SubtleText, Link
} from "ractf";
import { Wrap } from "./Parts";


export const JoinTeam = () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);

    if (api.team !== null)
        return <Redirect to={"/campaign"} />;

    const doJoinTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage(t("team_wiz.name_missing"));

        setLocked(true);
        endpoints.joinTeam(name, password).then(resp => {
            setSuccess(true);
        }).catch(e => {
            setMessage(endpoints.getError(e));
            setLocked(false);
        });
    };

    return <Page vCentre>
        <Wrap>{success ?
            <>
                <SectionTitle2>{t("team_wiz.joined")}</SectionTitle2>
                <HR />
                <div>{t("team_wiz.next")}</div>

                <FlexRow>
                    <Button large to={"/campaign"}>{t("challenge_plural")}</Button>
                    <Button large lesser to={"/settings"}>{t("setting_plural")}</Button>
                </FlexRow>
            </> : <>
                <SectionTitle2>{t("join_a_team")}</SectionTitle2>
                <SubtleText>
                    {t("team_wiz.did_you_want_to")}
                    <Link to={"/team/new"}>{t("team_wiz.create_a_team")}</Link>
                    {t("team_wiz.instead")}
                </SubtleText>
                <br />

                <Form locked={locked} handle={doJoinTeam}>
                    <Input autofill={"off"} name={"name"} placeholder={t("team_name")} />
                    <Input autofill={"off"} name={"password"} placeholder={t("team_secret")} password />

                    {message && <FormError>{message}</FormError>}

                    <Button large submit>{t("team_wiz.join")}</Button>
                </Form>
            </>}

        </Wrap>
    </Page>;
};


export const CreateTeam = () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const { t } = useTranslation();

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [locked, setLocked] = useState(false);

    if (api.team !== null)
        return <Redirect to={"/campaign"} />;

    const doCreateTeam = ({ name, password }) => {
        if (!name.length)
            return setMessage(t("team_wiz.name_missing"));
        if (password.length < 8)
            return setMessage(t("team_wiz.pass_short"));

        setLocked(true);
        endpoints.createTeam(name, password).then(resp => {
            endpoints._reloadCache();
            setSuccess(true);
        }).catch(e => {
            setMessage(endpoints.getError(e));
            setLocked(false);
        });
    };

    return <Page vCentre>
        <Wrap>{success ?
            <>
                <SectionTitle2>{t("team_wiz.created")}</SectionTitle2>
                <HR />
                <div>{t("team_wiz.next")}</div>

                <FlexRow>
                    <Button large to={"/campaign"}>{t("challenge_plural")}</Button>
                    <Button large lesser to={"/settings"}>{t("setting_plural")}</Button>
                </FlexRow>
            </> : <>
                <SectionTitle2>{t("create_a_team")}</SectionTitle2>
                <SubtleText>
                    {t("team_wiz.did_you_want_to")}
                    <Link to={"/team/join"}>{t("team_wiz.join_a_team")}</Link>
                    {t("team_wiz.instead")}
                </SubtleText>
                <br />

                <Form locked={locked} handle={doCreateTeam}>
                    <Input autofill={"off"} name={"name"} placeholder={t("team_name")} />
                    {/*<Input name={"affil"} placeholder={"Affiliation"} />
                    <Input name={"web"} placeholder={"Website"} />*/}
                    <Input autofill={"off"} name={"password"} placeholder={t("team_secret")} password />
                    <div style={{opacity: .5}}>{t("team_secret_warn")}</div>

                    {message && <FormError>{message}</FormError>}

                    <Button large submit>{t("team_wiz.create")}</Button>
                </Form>
            </>}
        </Wrap>
    </Page>;
};
