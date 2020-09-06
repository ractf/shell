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
import { useSelector, useDispatch } from "react-redux";
import { GiCaptainHatProfile } from "react-icons/gi";
import { useTranslation } from "react-i18next";

import { appContext, zxcvbn } from "ractf";
import { ENDPOINTS, modifyTeam, reloadAll } from "@ractf/api";
import { usePreferences, useExperiment } from "@ractf/util/hooks";
import { NUMBER_RE, useConfig } from "@ractf/util";
import http from "@ractf/http";
import {
    Page, HR, Row, Hint, Button, Form, SubtleText, Input,
    Checkbox, FormGroup, InputButton, Card, Column, PageHead, H6
} from "@ractf/ui-kit";
import * as actions from "actions";

import "./SettingsPage.scss";
import Link from "components/Link";


const makeOwner = (team, app, member, t) => {
    return () => {
        app.promptConfirm({
            message: (<>
                {t("settings.owner_confirm", { name: member.username })}<br /><br />
                {t("settings.stop_own_team")}
            </>), small: true
        }).then(() => {
            // Kick 'em
            modifyTeam("self", { owner: member.id }).then(() => {
                app.promptConfirm({ message: t("settings.no_longer_captain"), noCancel: true, small: true });
                reloadAll();
            }).catch(e => {
                app.promptConfirm({ message: t("error") + http.getError(e), noCancel: true, small: true });
            });
        }).catch(() => {
        });
    };
};


const TeamMember = ({ team, app, member, isOwner, isCaptain }) => {
    const { t } = useTranslation();

    return <div className={"memberTheme"}>
        <div className={"memberIcon" + (isOwner ? " clickable" : "") + (isCaptain ? " active" : "")}
            onClick={isOwner && !isCaptain ? makeOwner(team, app, member, t) : null}>
            <GiCaptainHatProfile />
        </div>
        <div>
            {member.username}
        </div>
    </div>;
};


export default () => {
    const app = useContext(appContext);
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const team = useSelector(state => state.team);
    const dispatch = useDispatch();
    const [preferences, setPreferences] = usePreferences();
    const hasTeams = useConfig("enable_teams");

    const passwordValidator = useCallback(({ old_password, password, new2 }) => {
        return new Promise((resolve, reject) => {
            if (!old_password)
                return reject({ old_password: t("settings.curr_pass_required") });
            if (!password)
                return reject({ password: t("settings.new_pass_required") });
            if (!new2)
                return reject({ new2: t("settings.new_pass_required") });
            if (password !== new2)
                return reject({ new2: t("auth.pass_match") });

            const strength = zxcvbn()(password);
            if (strength.score < 3)
                return reject({ password: strength.feedback.warning || t("auth.pass_weak") });

            resolve();
        });
    }, [t]);
    const passwordChanged = useCallback(() => {
        app.alert(t("settings.pass_changed"));
    }, [app, t]);

    const deleteValidator = useCallback(({ password }) => {
        return new Promise((resolve, reject) => {
            if (!password) return reject({ password: t("settings.curr_pass_required") });
            resolve();
        });
    }, [t]);

    const usernameValidator = useCallback(({ username }) => {
        return new Promise((resolve, reject) => {
            if (!username) return reject({ username: t("settings.uname_required") });
            if (username === user.username) return reject({ username: t("settings.uname_unchanged") });

            resolve();
        });
    }, [t, user.username]);
    const usernameChanged = useCallback(({ form: { username } }) => {
        app.alert(t("settings.uname_changed"));
        dispatch(actions.editUser({ username }));
    }, [app, dispatch, t]);
    const detailsUpdated = useCallback(() => {
        app.alert(t("settings.details_changed"));
        reloadAll();
    }, [app, t]);
    const teamUpdated = useCallback(() => {
        app.alert(t("settings.team_details_changed"));
        reloadAll();
    }, [app, t]);

    const saveNotificationPrefs = useCallback((args) => {
        setPreferences(args);
        app.alert(t("settings.notifications.success"));
    }, [app, setPreferences, t]);

    const teamOwner = (team ? team.owner === user.id : null);

    const notificationGroups = [
        { "name": "all_solves", "description": hasTeams ? "A team scores a flag" : "A player scores a flag" },
    ];

    const [accDeletion] = useExperiment("accDeletion");
    const [accOauth] = useExperiment("accOauth");

    return <Page title={t("settings.for", { name: user.username })}>
        <PageHead>
            {t("settings.for", { name: user.username })}
        </PageHead>
        <Column lgWidth={6} mdWidth={12}>
            {!user.has_2fa ? (
                <Card warning framed header={t("settings.cards.2fa")}>
                    <Row>
                        <H6>{t("settings.2fa.disabled")}</H6>
                        <SubtleText>{t("settings.2fa.prompt")}</SubtleText>
                    </Row>
                    <Row left>
                        <Link to={"/settings/2fa"}>
                            <Button warning>{t("settings.2fa.enable")}</Button>
                        </Link>
                    </Row>
                </Card>
            ) : (<Card header={t("settings.cards.2fa")}>
                <Row>
                    <p>{t("settings.2fa.enabled")}</p>
                </Row>
                <Row left>
                    <Link to={"/settings/2fa"}>
                        <Button>{t("settings.2fa.disable")}</Button>
                    </Link>
                </Row>
            </Card>
                )}
            <Card header={t("settings.cards.identity")}>
                <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} validator={usernameValidator}
                    postSubmit={usernameChanged}>
                    <FormGroup htmlFor={"username"} label={t("username")}>
                        <InputButton name={"username"} label={t("username")} val={user.username}
                            limit={36} placeholder={t("username")} button={t("save")} submit />
                    </FormGroup>
                </Form>
                {accOauth && (
                    <Row centre>
                        <Button disabled lesser>Link Google account</Button>
                        <Button disabled lesser>Link RACTF passport</Button>
                    </Row>
                )}
            </Card>
            <Card header={t("settings.cards.change_password")}>
                <Form action={ENDPOINTS.CHANGE_PASSWORD} method={"POST"} validator={passwordValidator}
                    postSubmit={passwordChanged}>
                    <FormGroup>
                        <Input password name={"old_password"} placeholder={t("curr_pass")} />
                        <Input zxcvbn={zxcvbn()} password name={"password"} placeholder={t("new_pass")} />
                        <Input password name={"new2"} placeholder={t("new_pass")} />
                    </FormGroup>
                    <Row>
                        <Button submit>{t("change_pass")}</Button>
                    </Row>
                </Form>
            </Card>
            <Card header={t("settings.cards.profile")}>
                <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} postSubmit={detailsUpdated}>
                    <FormGroup htmlFor={"discord"} label={<>
                        {t("settings.profile.discord")} <Hint>
                            You can find your discord ID by following the instructions <a
                                target="_blank" rel="noopener noreferrer"
                                href={("https://support.discord.com/hc/en-us/articles/206346498-" +
                                    "Where-can-I-find-my-User-Server-Message-ID-")}>
                                here
                                </a>.
                        </Hint>
                    </>}>
                        <Input name={"discord"} val={user.discord} limit={36}
                            placeholder={t("settings.profile.discord")} />
                        <Input name={"discordid"} val={user.discordid} format={NUMBER_RE} limit={18}
                            placeholder={t("settings.profile.discord_id")} />
                    </FormGroup>
                    <FormGroup htmlFor={"twitter"} label={t("settings.profile.twitter")}>
                        <Input name={"twitter"} val={user.twitter} limit={36}
                            placeholder={t("settings.profile.twitter")} />
                    </FormGroup>
                    <FormGroup htmlFor={"reddit"} label={t("settings.profile.reddit")}>
                        <Input name={"reddit"} val={user.reddit} limit={36}
                            placeholder={t("settings.profile.reddit")} />
                    </FormGroup>

                    <FormGroup htmlFor={"bio"} label={t("settings.profile.bio")}>
                        <Input name={"bio"} rows={5} val={user.bio} limit={400}
                            placeholder={t("settings.profile.bio")} />
                    </FormGroup>

                    <Row>
                        <Button submit>{t("save")}</Button>
                    </Row>
                </Form>
            </Card>
        </Column>
        <Column lgWidth={6} mdWidth={12}>
            {hasTeams && <>
                <Card header={t("settings.cards.team")}>
                    {team ? <>
                        <Form action={ENDPOINTS.TEAM + "self"} method={"PATCH"} postSubmit={teamUpdated}
                            locked={!teamOwner}>
                            <FormGroup htmlFor={"name"} label={t("team_name")}>
                                <Input val={team.name} name={"name"} limit={36} placeholder={t("team_name")} />
                            </FormGroup>
                            <FormGroup htmlFor={"desc"} label={t("team_desc")}>
                                <Input val={team.description} name={"desc"} rows={5} placeholder={t("team_desc")} />
                            </FormGroup>
                            <FormGroup htmlFor={"password"} label={t("team_secret")}>
                                <Input val={team.password} name={"password"} password placeholder={t("team_secret")} />
                                <SubtleText>{t("team_secret_warn")}</SubtleText>
                            </FormGroup>

                            {teamOwner && <Row>
                                <Button submit>{t("settings.modify_team")}</Button>
                            </Row>}
                        </Form>
                    </> : <div>
                            {t("settings.not_in_team")}
                            <br /><br />
                            {t("settings.team_prompt")}
                            <HR />
                            <Row>
                                <Link to={"/team/join"}>
                                    <Button>{t("join_a_team")}</Button>
                                </Link>
                                <Link to={"/team/new"}>
                                    <Button>{t("create_a_team")}</Button>
                                </Link>
                            </Row>
                        </div>}
                </Card>
                {team && (
                    <Card header={t("settings.cards.members")}>
                        {team.members.map((i, n) => (
                            <TeamMember key={n} team={team} app={app}
                                isCaptain={i.id === team.owner} isOwner={teamOwner} member={i} />
                        ))}
                    </Card>
                )}
            </>}
            <Card header={t("settings.cards.notifications")}>
                <Form handle={saveNotificationPrefs}>
                    <FormGroup label={t("settings.notifications.send_options")}>
                        {notificationGroups.map((group) =>
                            <Checkbox key={"notifs." + group.name} name={"notifs." + group.name}
                                val={preferences["notifs." + group.name]}>
                                {group.description}
                            </Checkbox>
                        )}
                    </FormGroup>
                    <Row>
                        <Button submit>{t("save")}</Button>
                    </Row>
                </Form>
            </Card>
            {accDeletion && (
                <Card danger framed header={t("settings.cards.danger")}>
                    <Form action={""} method={"POST"} validator={deleteValidator}>
                        <FormGroup htmlFor={"password"} label={t("curr_pass")}>
                            <Input name={"password"} label={t("curr_pass")} placeholder={t("curr_pass")} submit />
                        </FormGroup>
                        <Button danger submit>Delete my account</Button>
                    </Form>
                </Card>
            )}
        </Column>
    </Page>;
};
