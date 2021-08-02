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

import React, { useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GiCaptainHatProfile } from "react-icons/gi";

import { ENDPOINTS, leaveTeam, modifyTeam, reloadAll } from "@ractf/api";
import { useConfig, usePreferences, useExperiment } from "@ractf/shell-util";
import { NUMBER_RE } from "@ractf/util";
import * as http from "@ractf/util/http";
import {
    Page, HR, Hint, Button, Form, SubtleText, Input, Container,
    Checkbox, Card, Column, PageHead, UiKitModals
} from "@ractf/ui-kit";
import { mountPoint } from "@ractf/plugins";

import Link from "components/Link";

import "./SettingsPage.scss";


const makeOwner = (team, modals, member, t) => {
    return () => {
        modals.promptConfirm({
            message: (<>
                {t("settings.owner_confirm", { name: member.username })}<br /><br />
                {t("settings.stop_own_team")}
            </>), small: true
        }).then(() => {
            // Kick 'em
            modifyTeam("self", { owner: member.id }).then(() => {
                modals.promptConfirm({ message: t("settings.no_longer_captain"), noCancel: true, small: true });
                reloadAll();
            }).catch(e => {
                console.error(e);
                modals.promptConfirm({ message: t("error") + http.getError(e), noCancel: true, small: true });
            });
        }).catch(() => { });
    };
};

const TeamMember = ({ team, member, isOwner, isCaptain }) => {
    const { t } = useTranslation();
    const modals = useContext(UiKitModals);

    return <div className={"memberTheme"}>
        <div className={"memberIcon" + (isOwner ? " clickable" : "") + (isCaptain ? " active" : "")}
            onClick={isOwner && !isCaptain ? makeOwner(team, modals, member, t) : null}>
            <GiCaptainHatProfile />
        </div>
        <div>
            {member.username}
        </div>
    </div>;
};

const SettingsPage = () => {
    const modals = useContext(UiKitModals);
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const team = useSelector(state => state.team);
    const [preferences, setPreferences] = usePreferences();
    const hasTeams = useConfig("enable_teams");
    const solveBroadcastEnabled = useConfig("enable_solve_broadcast", true);

    const deleteValidator = useCallback(({ password }) => {
        return new Promise((resolve, reject) => {
            if (!password) return reject({ password: t("settings.curr_pass_required") });
            resolve();
        });
    }, [t]);

    const detailsUpdated = useCallback(() => {
        modals.alert(t("settings.details_changed"));
        reloadAll();
    }, [modals, t]);
    const teamUpdated = useCallback(() => {
        modals.alert(t("settings.team_details_changed"));
        reloadAll();
    }, [modals, t]);

    const saveNotificationPrefs = useCallback((args) => {
        setPreferences(args);
        modals.alert(t("settings.notifications.success"));
    }, [modals, setPreferences, t]);

    const doLeaveTeam = useCallback(() => {
        modals.promptConfirm({
            message: t("settings.team_leave_confirm"), small: true
        }).then(() => {
            leaveTeam().then(() => {
                modals.alert(t("settings.left_team"));
            }).catch(e => {
                modals.alert(t("settings.no_leave_team") + ": " + http.getError(e));
            });
        }).catch(() => { });
    }, [modals, t]);

    const teamOwner = (team ? team.owner === user.id : null);

    const notificationGroups = [
        solveBroadcastEnabled && { 
            name: "all_solves", description: hasTeams ? "A team scores a flag" : "A player scores a flag" 
        },
        hasTeams && { name: "team_join", description: "A user joins my team" },
        hasTeams && { name: "hint_used", description: "A team member uses a hint" },
        hasTeams && { name: "flag_reject", description: "A team member has a flag rejected" },
    ].filter(Boolean);

    const [accDeletion] = useExperiment("accDeletion");

    return <Page title={t("settings.for", { name: user.username })}>
        <PageHead>
            {t("settings.for", { name: user.username })}
        </PageHead>
        <Container.Row>
            <Column lgWidth={6} mdWidth={12}>
                {mountPoint("settingsLeftA")}
                <Card lesser header={t("settings.cards.profile")}>
                    <Form action={ENDPOINTS.USER + "self"} method={"PATCH"} postSubmit={detailsUpdated}>
                        <Form.Group htmlFor={"discord"} label={<>
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
                        </Form.Group>
                        <Form.Group htmlFor={"twitter"} label={t("settings.profile.twitter")}>
                            <Input name={"twitter"} val={user.twitter} limit={36}
                                placeholder={t("settings.profile.twitter")} />
                        </Form.Group>
                        <Form.Group htmlFor={"reddit"} label={t("settings.profile.reddit")}>
                            <Input name={"reddit"} val={user.reddit} limit={36}
                                placeholder={t("settings.profile.reddit")} />
                        </Form.Group>

                        <Form.Group htmlFor={"bio"} label={t("settings.profile.bio")}>
                            <Input name={"bio"} rows={5} val={user.bio} limit={400}
                                placeholder={t("settings.profile.bio")} />
                        </Form.Group>

                        <Button submit>{t("save")}</Button>
                    </Form>
                </Card>
                {mountPoint("settingsLeftB")}
            </Column>
            <Column lgWidth={6} mdWidth={12}>
                {mountPoint("settingsRightA")}
                {hasTeams && <>
                    <Card lesser header={t("settings.cards.team")}>
                        {team ? <>
                            <Form action={ENDPOINTS.TEAM + "self"} method={"PATCH"} postSubmit={teamUpdated}
                                locked={!teamOwner}>
                                <Form.Group htmlFor={"name"} label={t("team_name")}>
                                    <Input val={team.name} name={"name"} limit={36} placeholder={t("team_name")} />
                                </Form.Group>
                                <Form.Group htmlFor={"description"} label={t("team_desc")}>
                                    <Input val={
                                        team.description
                                    } name={"description"} rows={5} placeholder={t("team_desc")} />
                                </Form.Group>
                                <Form.Group htmlFor={"password"} label={t("team_secret")}>
                                    <Input val={team.password} name={"password"}
                                        password placeholder={t("team_secret")} />
                                    <SubtleText>{t("team_secret_warn")}</SubtleText>
                                </Form.Group>

                                {teamOwner && <>
                                    <Button submit>{t("settings.modify_team")}</Button>
                                </>}
                            </Form>
                            <Button onClick={doLeaveTeam} danger lesser>
                                {t("settings.leave_team")}
                            </Button>
                        </> : <div>
                                {t("settings.not_in_team")}
                                <br /><br />
                                {t("settings.team_prompt")}
                                <HR />
                                <Container toolbar centre>
                                    <Link to={"/team/join"}>
                                        <Button>{t("join_a_team")}</Button>
                                    </Link>
                                    <Link to={"/team/create"}>
                                        <Button>{t("create_a_team")}</Button>
                                    </Link>
                                </Container>
                            </div>}
                    </Card>
                    {team && (
                        <Card lesser header={t("settings.cards.members")}>
                            {team.members.map((i, n) => (
                                <TeamMember key={n} team={team}
                                    isCaptain={i.id === team.owner} isOwner={teamOwner} member={i} />
                            ))}
                        </Card>
                    )}
                </>}
                <Card lesser header={t("settings.cards.notifications")}>
                    <Form handle={saveNotificationPrefs} disableDotExpansion>
                        <Form.Group label={t("settings.notifications.send_options")}>
                            {notificationGroups.map((group) =>
                                <Checkbox key={`notifs.${group.name}`} name={`notifs.${group.name}`}
                                    val={preferences[`notifs.${group.name}`]}>
                                    {group.description}
                                </Checkbox>
                            )}
                        </Form.Group>
                        <Button submit>{t("save")}</Button>
                    </Form>
                </Card>
                {accDeletion && (
                    <Card lesser danger header={t("settings.cards.danger")}>
                        <Form action={""} method={"POST"} validator={deleteValidator}>
                            <Form.Group htmlFor={"password"} label={t("curr_pass")}>
                                <Input name={"password"} label={t("curr_pass")} placeholder={t("curr_pass")} submit />
                            </Form.Group>
                            <Button danger submit>Delete my account</Button>
                        </Form>
                    </Card>
                )}
                {mountPoint("settingsRightB")}
            </Column>
        </Container.Row>
    </Page>;
};
export default SettingsPage;
