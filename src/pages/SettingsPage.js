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

import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GiCaptainHatProfile } from "react-icons/gi";
import { useTranslation } from "react-i18next";

import { appContext, zxcvbn, getLocalConfig } from "ractf";
import { ENDPOINTS, modifyTeam, reloadAll } from "@ractf/api";
import http from "@ractf/http";
import {
    Page, HR, Row, TabbedView, Tab, Button, Form, FormError, Input,
    Checkbox, FormGroup, InputButton, Leader
} from "@ractf/ui-kit";
import * as actions from "actions";

import "./SettingsPage.scss";


const makeOwner = (team, app, member, t) => {
    return () => {
        app.promptConfirm({
            message: (<>
                {t("settings.owner_confirm", { name: member.username })}<br /><br />
                {t("settings.stop_own_team")}
            </>), small: true
        }).then(() => {
            // Kick 'em
            modifyTeam("self", { captain: member.id }).then(() => {
                app.promptConfirm({ message: t("settings.no_longer_captain"), noCancel: true, small: true });
                reloadAll();
            }).catch(e => {
                app.promptConfirm({ message: t("error") + http.getError(e), noCancel: true, small: true });
            });
        }).catch(() => {
        });
    };
};


const TeamMember = ({ team, endpoints, app, member, isOwner, isCaptain }) => {
    const { t } = useTranslation();

    return <div className={"memberTheme"}>
        <div className={"memberIcon" + (isOwner ? " clickable" : "") + (isCaptain ? " active" : "")}
            onClick={isOwner && !isCaptain ? makeOwner(team, endpoints, app, member, t) : null}>
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

    const passwordValidator = ({ old_password, password, new2 }) => {
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
    };
    const passwordChanged = () => {
        app.alert(t("settings.pass_changed"));
    };

    const usernameValidator = ({ username }) => {
        return new Promise((resolve, reject) => {
            if (!username) return reject({ username: t("settings.uname_required") });
            if (username === user.username) return reject({ username: t("settings.uname_unchanged") });

            resolve();
        });
    };
    const usernameChanged = ({ form: { username } }) => {
        app.alert(t("settings.uname_changed"));
        dispatch(actions.editUser({ username }));
    };
    const detailsUpdated = () => {
        app.alert(t("settings.details_changed"));
        reloadAll();
    };
    const teamUpdated = () => {
        app.alert(t("settings.team_details_changed"));
        reloadAll();
    };

    const saveNotificationPrefs = (args) => {
        dispatch(actions.setPreferences(args));
        app.alert(t("settings.notifications.success"));
    };

    const teamOwner = (team ? team.owner === user.id : null);

    const notificationGroups = [
        { "name": "all_solves", "description": "A team scores a flag" },
    ];

    return <Page title={t("settings.for", { name: user.username })}>
        <TabbedView>
            <Tab label={t("user")}>
                <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} validator={usernameValidator}
                    postSubmit={usernameChanged}>
                    <FormGroup htmlFor={"username"} label={t("username")}>
                        <InputButton name={"username"} label={t("username")} val={user.username}
                            limit={36} placeholder={t("username")} button={t("save")} submit />
                    </FormGroup>
                </Form>
                <HR />
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
                {
                    user.totp_status !== 2 && <>
                        <HR />
                        <Leader sub={t("settings.enable_2fa")}>{t("settings.2fa_disabled")}</Leader>
                        <HR />

                        <Row>
                            <FormError></FormError>
                        </Row>
                        <Row>
                            <Button to={"/settings/2fa"}></Button>
                        </Row>
                    </>
                }
            </Tab>
            <Tab label={t("settings.profile")}>
                <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} postSubmit={detailsUpdated}>
                    <FormGroup htmlFor={"discord"} label={t("settings.discord")}>
                        <Input name={"discord"} val={user.discord} limit={36} placeholder={t("settings.discord")} />
                        <Input name={"discordid"} val={user.discordid} format={/\d+/} limit={18}
                            placeholder={t("settings.discord_id")} />
                    </FormGroup>
                    <FormGroup htmlFor={"twitter"} label={t("settings.twitter")}>
                        <Input name={"twitter"} val={user.twitter} limit={36} placeholder={t("settings.twitter")} />
                    </FormGroup>
                    <FormGroup htmlFor={"reddit"} label={t("settings.reddit")}>
                        <Input name={"reddit"} val={user.reddit} limit={36} placeholder={t("settings.reddit")} />
                    </FormGroup>

                    <FormGroup htmlFor={"bio"} label={t("bio")}>
                        <Input name={"bio"} rows={5} val={user.bio} limit={400} placeholder={t("bio")} />
                    </FormGroup>

                    <Row>
                        <Button submit>{t("save")}</Button>
                    </Row>
                </Form>
            </Tab>
            <Tab label={t("team")}>
                {team ? <>
                    <Form action={ENDPOINTS.TEAM + "self"} method={"PATCH"} postSubmit={teamUpdated}
                        locked={!teamOwner}>
                        <FormGroup htmlFor={"name"} label={t("team_name")}>
                            <Input val={team.name} name={"name"} limit={36} placeholder={t("team_name")} />
                        </FormGroup>
                        <FormGroup htmlFor={"desc"} label={t("team_desc")}>
                            <Input val={team.description} name={"desc"} rows={5} placeholder={t("team_desc")} />
                        </FormGroup>
                        <FormGroup htmlFor={"pass"} label={t("team_secret")}>
                            <Input val={team.password} name={"pass"} password placeholder={t("team_secret")} />
                            <div style={{ opacity: .5 }}>{t("team_secret_warn")}</div>
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
                            <Button to={"/team/join"}>{t("join_a_team")}</Button>
                            <Button to={"/team/new"}>{t("create_a_team")}</Button>
                        </Row>
                    </div>}
            </Tab>
            {team &&
                <Tab label={t("team_members")}>
                    <br />
                    {team.members.map((i, n) => (
                        <TeamMember key={n} team={team} app={app}
                            isCaptain={i.id === team.owner} isOwner={teamOwner} member={i} />
                    ))}
                </Tab>
            }
            <Tab label={t("settings.notifications.title")}>
                <Form handle={saveNotificationPrefs}>
                    <FormGroup label={t("settings.notifications.send_options")}>
                        {notificationGroups.map((group) =>
                            <Checkbox key={group.name} name={group.name}
                                val={getLocalConfig("notifs." + group.name, undefined, true)}>
                                {group.description}
                            </Checkbox>
                        )}
                    </FormGroup>
                    <Row>
                        <Button submit>{t("save")}</Button>
                    </Row>
                </Form>
            </Tab>
        </TabbedView>
    </Page>;
};
