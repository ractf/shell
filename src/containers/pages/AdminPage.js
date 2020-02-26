import React, { useContext, useState, useEffect } from "react";
import useReactRouter from "../../useReactRouter";
import DatePicker from "react-datepicker";

import {
    Page, Form, Input, Button, Radio, Spinner, SBTSection, Section, apiContext,
    apiEndpoints, appContext, useApi, ENDPOINTS
} from "ractf";

import "react-datepicker/dist/react-datepicker.css";
import "./AdminPage.scss";


const MemberCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);

    const configSet = (key, value) => {
        endpoints.modifyUser(data.id, { [key]: value }).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(endpoints.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.username}</div>
        <div className={"absmBody"}>
            {!data.is_staff &&
                <div className={"absfg"}>
                    Account Active
                <Radio onChange={v => configSet("is_active", v)} value={data.is_active}
                        options={[["Enabled", true], ["Disabled", false]]} />
                </div>
            }
            <div className={"absfg"}>
                Account Visible
                <Radio onChange={v => configSet("is_visible", v)} value={data.is_visible}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>
            <div className={"absmVml"}>VIEW MORE</div>
        </div>
    </div>;
};


const TeamCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);

    const configSet = (key, value) => {
        endpoints.modifyTeam(data.id, { [key]: value }).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(endpoints.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.name}</div>
        <div className={"absmBody"}>
            <div className={"absfg"}>
                Team Visible
                <Radio onChange={v => configSet("visible", v)} value={data.is_visible || false}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>
            <div className={"absmVml"}>VIEW MORE</div>
        </div>
    </div>;
};


const DatePick = ({ initial, configSet, name, configKey }) => {
    const [value, setValue] = useState(initial * 1000);

    const onChange = value => {
        setValue(value);
        configSet(configKey, value.getTime() / 1000);
    };

    return <DatePicker showTimeSelect
        dateFormat="yyyy-MM-dd H:mm"
        autoComplete="off"
        selected={value}
        onChange={onChange}
        style={{zIndex: 50}}
        name={name} />;
};


export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const [adminConfig, setAdminConfig] = useState(null);

    const [allUsersAdmin] = useApi(ENDPOINTS.USER);
    const [allTeamsAdmin] = useApi(ENDPOINTS.TEAM);
    const [adminConfig_] = useApi(ENDPOINTS.CONFIG);
    
    const { match } = useReactRouter();
    if (!match) return "uuuh.. admin?";
    const page = match.params.page;

    const configSet = (key, value) => {
        endpoints.setConfigValue(key, value).then(() => {
            if (api.config)
                api.config[key] = value;
            setAdminConfig({...adminConfig, key: value});
        }).catch(e => {
            console.error(e);
            app.alert(endpoints.getError(e));
        });
    };

    useEffect(() => {
        if (adminConfig_) {
            let config = {};
            adminConfig_.forEach(({ key, value }) => config[key] = value.value);
            setAdminConfig(config);
        }
    }, [adminConfig_]);

    let content;
    switch (page) {
        case "ctf":
            content = <SBTSection title={"CTF Management"}>
                {adminConfig ? <>
                    <Section title={"Start or Stop"}>
                        <div className={"absfg"}>
                            Start the event before the scheduled start time.
                            <Button>Start event</Button>
                        </div>
                        <div className={"absfg"}>
                            End the event before the scheduled end time.
                            This will not disable automatic-start.
                            <Button>Stop event</Button>
                        </div>
                    </Section>
                    <Section title={"Automatic Timing"}>
                        <Form>
                            <div className={"absfg"}>
                                <Form>
                                    <label htmlFor={"regStartTime"}>Registration start time</label>
                                    <DatePick initial={adminConfig.register_start_time}
                                              configSet={configSet} name={"regStartTime"}
                                              configKey={"register_start_time"} />
                                </Form>
                            </div>
                            <div className={"absfg"}>
                                <Form>
                                    <label htmlFor={"eventStartTime"}>Event start time</label>
                                    <DatePick initial={adminConfig.start_time}
                                              configSet={configSet} name={"eventStartTime"}
                                              configKey={"start_time"} />
                                </Form>
                            </div>
                            <div className={"absfg"}>
                                <Form>
                                    <label htmlFor={"eventEndTime"}>Event end time</label>
                                    <DatePick initial={adminConfig.end_time}
                                              configSet={configSet} name={"eventEndTime"}
                                              configKey={"end_time"} />
                                </Form>
                            </div>
                        </Form>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "config":
            content = <SBTSection title={"Configuration"}>
                {adminConfig ? <>
                    <Section title={"Login"}>
                        <Form>
                            <div className={"absfg"}>
                                Enable or disable site login
                                <Radio onChange={v => configSet("login", v)} value={adminConfig.login}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={"Registration"}>
                        <Form>
                            <div className={"absfg"}>
                                Enable or disable site registration
                                <Radio onChange={v => configSet("register", v)} value={adminConfig.register}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={"Main Game"}>
                        <Form>
                            <div className={"absfg"}>
                                Scoring
                                <Radio onChange={v => configSet("scoring", v)} value={adminConfig.scoring}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                            <div className={"absfg"}>
                                Flag Submission
                                <Radio onChange={v => configSet("flags", v)} value={adminConfig.flags}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "service":
            content = <SBTSection title={"Service Status"}>
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
            content = <SBTSection title={"Announcements"}>
                <Section title={"Active Announcements"}>
                    <Form>
                        <label>No announcements active</label>
                    </Form>
                </Section>
                <Section title={"Add Announcement"}>
                    <Form>
                        <label htmlFor={"annTitle"}>Title</label>
                        <Input name={"annTitle"} />
                        <label htmlFor={"annBody"}>Announcement text</label>
                        <Input name={"annBody"} rows={4} />
                        <Button>Add</Button>
                    </Form>
                </Section>
            </SBTSection>;
            break;
        case "members":
            content = <SBTSection title={"Members"}>
                {allUsersAdmin ? <>
                    <Section title={"Admins"}>
                        {allUsersAdmin.filter(i => i.is_staff).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                    <Section title={"Standard Users"}>
                        {allUsersAdmin.filter(i => !i.is_staff).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "teams":
            content = <SBTSection title={"Teams"}>
                {allTeamsAdmin ? <>
                    <Section title={"All Teams"}>
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
