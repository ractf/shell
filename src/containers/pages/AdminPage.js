import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import useReactRouter from "../../useReactRouter";
import DatePicker from "react-datepicker";

import {
    Page, Form, Input, Button, Radio, Spinner, SBTSection, Section, apiContext,
    apiEndpoints, appContext, useApi
} from "ractf";

import "react-datepicker/dist/react-datepicker.css";
import "./AdminPage.scss";


const MemberCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const { t } = useTranslation();

    const configSet = (key, value) => {
        endpoints.modifyUserAdmin(data.id, {[key]: value}).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(endpoints.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.name}</div>
        <div className={"absmBody"}>
            <div className={"absfg"}>
                {t("admin.account_active")}
                <Radio onChange={v => configSet(t("admin.enabled"), v)} value={data.enabled}
                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
            </div>
            <div className={"absfg"}>
            {t("admin.account_visible")}
                <Radio onChange={v => configSet("visible", v)} value={data.visible}
                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
            </div>
            <div className={"absmVml"}>{t("admin.view_more")}</div>
        </div>
    </div>;
};


const TeamCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const { t } = useTranslation();

    const configSet = (key, value) => {
        endpoints.modifyTeamAdmin(data.id, {[key]: value}).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(endpoints.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.name}</div>
        <div className={"absmBody"}>
            <div className={"absfg"}>
                {t("admin.team_visible")}
                <Radio onChange={v => configSet("visible", v)} value={data.visible}
                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
            </div>
            <div className={"absmVml"}>{t("admin.view_more")}</div>
        </div>
    </div>;
};


export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const { t } = useTranslation();

    const [allUsersAdmin] = useApi("/admin/members");
    const [allTeamsAdmin] = useApi("/admin/teams");
    const [adminConfig] = useApi("/admin/config");

    const { match } = useReactRouter();
    if (!match) return "uuuh.. admin?";
    const page = match.params.page;

    const configSet = (key, value) => {
        endpoints.setConfigValue(key, value).then(() => {
            api.config[key] = value;
            adminConfig[key] = value;
        }).catch(e => {
            app.alert(endpoints.getError(e));
        });
    };

    let content;
    switch (page) {
        case "ctf":
            content = <SBTSection title={t("admin.event")}>
                {adminConfig ? <>
                    <Section title={t("admin.start_stop")}>
                        <div className={"absfg"}>
                            {t("admin.start_desc")}
                            <Button>{t("admin.start")}</Button>
                        </div>
                        <div className={"absfg"}>
                            {t("admin.stop_desc")}
                            <Button>{t("admin.stop")}</Button>
                        </div>
                    </Section>
                    <Section title={t("admin.auto_time")}>
                        <Form>
                            <div className={"absfg"}>
                                <Form>
                                    <label htmlFor={"eventStartTime"}>{t("admin.start_time")}</label>
                                    <DatePicker showTimeSelect
                                        dateFormat="yyyy-MM-dd H:mm"
                                        autoComplete="off"
                                        selected={adminConfig.startTime}
                                        onChange={date => configSet("startTime", date)}
                                        name={"eventStartTime"} />
                                </Form>
                            </div>
                            <div className={"absfg"}>
                                <Form>
                                    <label htmlFor={"eventEndTime"}>{t("admin.stop_time")}</label>
                                    <DatePicker showTimeSelect
                                        dateFormat="yyyy-MM-dd H:mm"
                                        autoComplete="off"
                                        selected={adminConfig.endTime}
                                        onChange={date => configSet("endTime", date)}
                                        name={"eventEndTime"} />
                                </Form>
                            </div>
                        </Form>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "config":
            content = <SBTSection title={t("admin.configuration")}>
                {adminConfig ? <>
                    <Section title={t("admin.login")}>
                        <Form>
                            <div className={"absfg"}>
                                {t("admin.enable_login")}
                                <Radio onChange={v => configSet("login", v)} value={adminConfig.login}
                                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={t("admin.reg")}>
                        <Form>
                            <div className={"absfg"}>
                                {t("admin.enable_registration")}
                                <Radio onChange={v => configSet("registration", v)} value={adminConfig.registration}
                                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={t("admin.main_game")}>
                        <Form>
                            <div className={"absfg"}>
                                {t("admin.scoring")}
                                <Radio onChange={v => configSet("scoring", v)} value={adminConfig.scoring}
                                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                            </div>
                            <div className={"absfg"}>
                                {t("admin.flags")}
                                <Radio onChange={v => configSet("flags_on", v)} value={adminConfig.flags_on}
                                    options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                            </div>
                        </Form>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "service":
            content = <SBTSection title={t("admin.service")}>
                <Section title={"Code Ingest"}>
                    <div className={"absIndicator unknown"} />
                </Section>
                <Section title={"Mail Daemon"}>
                    <div className={"absIndicator online"} />
                </Section>
                <Section title={"Cespit"}>
                    <div className={"absIndicator offline"} />
                </Section>
                <Section title={"Staging"}>
                    <div className={"absIndicator partial"} />
                </Section>
            </SBTSection>;
            break;
        case "announcements":
            content = <SBTSection title={t("admin.announce.head")}>
                <Section title={t("admin.announce.active")}>
                    <Form>
                        <label>{t("admin.announce.none")}</label>
                    </Form>
                </Section>
                <Section title={t("admin.announce.add")}>
                    <Form>
                        <label htmlFor={"annTitle"}>{t("admin.announce.title")}</label>
                        <Input name={"annTitle"} />
                        <label htmlFor={"annBody"}>{t("admin.announce.body")}</label>
                        <Input name={"annBody"} rows={4} />
                        <Button>{t("admin.announce.add")}</Button>
                    </Form>
                </Section>
            </SBTSection>;
            break;
        case "members":
            content = <SBTSection title={t("admin.members")}>
                {allUsersAdmin ? <>
                    <Section title={t("admin.admins")}>
                        {allUsersAdmin.filter(i => i.is_admin).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                    <Section title={t("admin.users")}>
                        {allUsersAdmin.filter(i => !i.is_admin).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "teams":
            content = <SBTSection title={t("admin.teams")}>
                {allTeamsAdmin ? <>
                    <Section title={t("admin.all_teams")}>
                        {allTeamsAdmin.map(i =>
                            <TeamCard key={i.id} data={i} />
                        )}
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        default:
            content = <Spinner />;
            break;
    }

    return <Page selfContained>
        {content}
    </Page>;
};
