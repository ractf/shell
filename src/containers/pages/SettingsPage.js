import React, { useContext, useState } from "react";
import { GiCaptainHatProfile } from "react-icons/gi";
import { useTranslation } from 'react-i18next';

import {
    Page, HR, FlexRow, TabbedView, Tab, Button, Form, FormError, Input,
    Checkbox, FormGroup
} from "@ractf/ui-kit";
import { apiContext, appContext, apiEndpoints, zxcvbn, localConfig } from "ractf";

import "./SettingsPage.scss";


const makeOwner = (api, endpoints, app, member, t) => {
    return () => {
        app.promptConfirm({
            message: (<>
                {t("settings.owner_confirm", { name: member.username })}<br /><br />
                {t("settings.stop_own_team")}
            </>), small: true
        }).then(() => {
            // Kick 'em
            endpoints.modifyTeam(api.team.id, { captain: member.id }).then(() => {
                app.promptConfirm({ message: t("settings.no_longer_captain"), noCancel: true, small: true });
                endpoints.setup();
            }).catch(e => {
                endpoints.promptConfirm({ message: t("error") + endpoints.getError(e), noCancel: true, small: true });
            });
        }).catch(() => {
        });
    };
};


const TeamMember = ({ api, endpoints, app, member, isOwner, isCaptain }) => {
    const { t } = useTranslation();

    return <div className={"memberTheme"}>
        <div className={"memberIcon" + (isOwner ? " clickable" : "") + (isCaptain ? " active" : "")}
            onClick={isOwner && !isCaptain ? makeOwner(api, endpoints, app, member, t) : null}>
            <GiCaptainHatProfile />
        </div>
        <div>
            {member.username}
        </div>
    </div>;
};


export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const { t } = useTranslation();

    const [unError, setUnError] = useState("");
    const [pfError, setPfError] = useState("");
    const [pwError, setPwError] = useState("");
    const [teamError, setTeamError] = useState("");

    const changePassword = ({ old, new1, new2 }) => {
        if (!old)
            return setPwError(t("settings.curr_pass_required"));
        if (!new1 || !new2)
            return setPwError(t("settings.new_pass_required"));
        if (new1 !== new2)
            return setPwError(t("auth.pass_match"));

        const strength = zxcvbn()(new1);
        if (strength.score < 3)
            return setPwError((strength.feedback.warning || t("auth.pass_weak")));

        endpoints.changePassword(new1, old).then(() => {
            app.alert(t("settings.pass_changed"));
            endpoints.logout();
        }).catch(e => {
            setPwError(endpoints.getError(e));
        });
    };

    const changeUsername = ({ name }) => {
        if (!name)
            return setUnError(t("settings.uname_required"));
        if (name === api.user.username)
            return setUnError(t("settings.uname_unchanged"));

        endpoints.modifyUser("self", { name: name }).then(() => {
            app.alert(t("settings.uname_changed"));
            endpoints.logout();
        }).catch(e => {
            setUnError(endpoints.getError(e));
        });
    };

    const updateDetails = ({ discord, discordid, twitter, reddit, bio }) => {
        endpoints.modifyUser("self", {
            discord: discord, discordid: discordid, twitter: twitter, reddit: reddit, bio: bio
        }).then(() => {
            app.alert(t("settings.details_changed"));
            endpoints.setup();
            setPfError(null);
        }).catch(e => {
            setPfError(endpoints.getError(e));
        });
    };

    const alterTeam = ({ name, desc, pass }) => {
        endpoints.modifyTeam("self", { name: name, description: desc, password: pass }).then(() => {
            app.alert(t("settings.team_details_changed"));
            endpoints.setup();
            setTeamError(null);
        }).catch(e => {
            setTeamError(endpoints.getError(e));
        });
    };

    const saveNotificationPrefs = (args) => {
        Object.keys(args).map((key) => {
            return localConfig("notifs." + key, args[key]);
        });
        app.alert(t("settings.notifications.success"));
    };

    const teamOwner = (api.team ? api.team.owner === api.user.id : null);

    const notificationGroups = [
        { "name": "all_solves", "description": "A team scores a flag" },
    ];

    return <Page title={t("settings.for", { name: api.user.username })}>
        <TabbedView>
            <Tab label={t("user")}>
                {
                    api.user.totp_status !== 2 && <>
                        <FlexRow>
                            <FormError>{t("settings.2fa_disabled")}</FormError>
                        </FlexRow>
                        <FlexRow>
                            <Button to={"/settings/2fa"}>{t("settings.enable_2fa")}</Button>
                        </FlexRow>
                        <HR />
                    </>
                }

                <Form handle={changeUsername}>
                    <FormGroup htmlFor={"name"} label={t("username")}>
                        <Input name={"name"} val={api.user.username} limit={36}
                            placeholder={t("username")} />
                    </FormGroup>

                    {unError && <FormError>{unError}</FormError>}
                    <FlexRow>
                        <Button submit>{t("save")}</Button>
                    </FlexRow>
                </Form>
                <HR />
                <Form handle={changePassword}>
                    <FormGroup>
                        <Input password name={"old"} placeholder={t("curr_pass")} />
                        <Input zxcvbn={zxcvbn()} password name={"new1"} placeholder={t("new_pass")} />
                        <Input password name={"new2"} placeholder={t("new_pass")} />
                    </FormGroup>

                    {pwError && <FormError>{pwError}</FormError>}
                    <FlexRow>
                        <Button submit>{t("change_pass")}</Button>
                    </FlexRow>
                </Form>
            </Tab>
            <Tab label={t("settings.profile")}>
                <Form handle={updateDetails}>
                    <FormGroup htmlFor={"discord"} label={t("settings.discord")}>
                        <Input name={"discord"} val={api.user.discord} limit={36} placeholder={t("settings.discord")} />
                        <Input name={"discordid"} val={api.user.discordid} format={/\d+/} limit={18}
                            placeholder={t("settings.discord_id")} />
                    </FormGroup>
                    <FormGroup htmlFor={"twitter"} label={t("settings.twitter")}>
                        <Input name={"twitter"} val={api.user.twitter} limit={36} placeholder={t("settings.twitter")} />
                    </FormGroup>
                    <FormGroup htmlFor={"reddit"} label={t("settings.reddit")}>
                        <Input name={"reddit"} val={api.user.reddit} limit={36} placeholder={t("settings.reddit")} />
                    </FormGroup>

                    <FormGroup htmlFor={"bio"} label={t("bio")}>
                        <Input name={"bio"} rows={5} val={api.user.bio} limit={400} placeholder={t("bio")} />
                    </FormGroup>

                    {pfError && <FormError>{pfError}</FormError>}
                    <FlexRow>
                        <Button submit>{t("save")}</Button>
                    </FlexRow>
                </Form>
            </Tab>
            <Tab label={t("team")}>
                {api.team ? <>
                    <Form handle={alterTeam} locked={!teamOwner}>
                        <FormGroup htmlFor={"name"} label={t("team_name")}>
                            <Input val={api.team.name} name={"name"} limit={36} placeholder={t("team_name")} />
                        </FormGroup>
                        <FormGroup htmlFor={"desc"} label={t("team_desc")}>
                            <Input val={api.team.description} name={"desc"} rows={5} placeholder={t("team_desc")} />
                        </FormGroup>
                        <FormGroup htmlFor={"pass"} label={t("team_secret")}>
                            <Input val={api.team.password} name={"pass"} password placeholder={t("team_secret")} />
                            <div style={{ opacity: .5 }}>{t("team_secret_warn")}</div>
                        </FormGroup>

                        {teamError && <FormError>{teamError}</FormError>}
                        {teamOwner && <FlexRow>
                            <Button submit>{t("settings.modify_team")}</Button>
                        </FlexRow>}
                    </Form>
                </> : <div>
                        {t("settings.not_in_team")}
                        <br /><br />
                        {t("settings.team_prompt")}
                        <HR />
                        <FlexRow>
                            <Button to={"/team/join"}>{t("join_a_team")}</Button>
                            <Button to={"/team/new"}>{t("create_a_team")}</Button>
                        </FlexRow>
                    </div>}
            </Tab>
            {api.team &&
                <Tab label={t("team_members")}>
                    <br />
                    {api.team.members.map((i, n) => (
                        <TeamMember key={n} api={api} endpoints={endpoints} app={app}
                            isCaptain={i.id === api.team.owner} isOwner={teamOwner} member={i} />
                    ))}
                </Tab>
            }
            <Tab label={t("settings.notifications.title")}>
                <Form handle={saveNotificationPrefs}>
                    <FormGroup label={t("settings.notifications.send_options")}>
                        {notificationGroups.map((group) =>
                            <Checkbox key={group.name} name={group.name}
                                checked={localConfig("notifs." + group.name, undefined, true)}>
                                {group.description}
                            </Checkbox>
                        )}
                    </FormGroup>
                    <FlexRow>
                        <Button submit>{t("save")}</Button>
                    </FlexRow>
                </Form>
            </Tab>
        </TabbedView>
    </Page>;
};
