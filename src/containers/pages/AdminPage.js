import React, { useContext, useState, useEffect } from "react";

import { Page, Form, Input, Button, Radio, Spinner, apiContext, appContext } from "ractf";

import logo from "../../static/wordmark.png";

import "./AdminPage.scss";


const Section = ({ title, children }) => <>
    <div className={"abSection"}>
        <div className={"absTitle"}>{title}</div>
        <div className={"absBody"}>
            {children}
        </div>
    </div>
</>;


const AdminTabs = ({ children }) => {
    const [active, setActive] = useState(0);

    return <div className={"adminWrap"}>
        <div className={"adminSidebar"}>
            <img className={"asbBrand"} alt={""} src={logo} />
            {children.map((i, n) =>
                <div key={i.props.title} className={"asbItem" + (n === active ? " asbActive" : "")}
                    onClick={() => setActive(n)}>
                    {i.props.title}
                </div>
            )}
            <div style={{ flexGrow: 1 }} />
            <div className={"asbItem"} style={{ textAlign: "center" }}>Back Home</div>
        </div>
        <div className={"adminBody"}>
            {children.map((i, n) => <div key={i.props.title} style={{ display: n === active ? "block" : "none" }}>
                {i}
            </div>)}
        </div>
    </div>
};


const AdminSection = ({ title, children }) => {
    return <>
        <div className={"abTitle"}>{title}</div>
        {children}
    </>
};


const MemberCard = ({ data }) => {
    const api = useContext(apiContext);
    const app = useContext(appContext);

    const configSet = (key, value) => {
        api.modifyUserAdmin(data.id, {[key]: value}).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(api.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.name}</div>
        <div className={"absmBody"}>
            <div className={"absfg"}>
                Account Active
                <Radio onChange={v => configSet("enabled", v)} value={data.enabled}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>
            <div className={"absfg"}>
                Account Visible
                <Radio onChange={v => configSet("visible", v)} value={data.visible}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>
            <div className={"absmVml"}>VIEW MORE</div>
        </div>
    </div>;
};


const TeamCard = ({ data }) => {
    const api = useContext(apiContext);
    const app = useContext(appContext);

    const configSet = (key, value) => {
        api.modifyTeamAdmin(data.id, {[key]: value}).then(() => {
            data[key] = value;
        }).catch(e => {
            app.alert(api.getError(e));
        });
    };

    return <div className={"absMember"}>
        <div className={"absmName"}>{data.name}</div>
        <div className={"absmBody"}>
            <div className={"absfg"}>
                Team Visible
                <Radio onChange={v => configSet("visible", v)} value={data.visible}
                    options={[["Enabled", true], ["Disabled", false]]} />
            </div>
            <div className={"absmVml"}>VIEW MORE</div>
        </div>
    </div>;
};


export default () => {
    const api = useContext(apiContext);
    const app = useContext(appContext);

    useEffect(() => {
        api.ensure("allUsersAdmin").catch(e => app.alert("Error listing users:\n" + api.getError(e)));
        api.ensure("allTeamsAdmin").catch(e => app.alert("Error listing teams:\n" + api.getError(e)));
        api.ensure("adminConfig").catch(e => app.alert("Error getting config:\n" + api.getError(e)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const configSet = (key, value) => {
        api.setConfigValue(key, value).then(() => {
            api.config[key] = value;
            api.adminConfig[key] = value;
        }).catch(e => {
            app.alert(api.getError(e));
        });
    };

    return <Page selfContained>
        <AdminTabs>
            <AdminSection title={"Configuration"}>
                {api.adminConfig ? <>
                    <Section title={"Login"}>
                        <Form>
                            <div className={"absfg"}>
                                Enable or disable site login
                                <Radio onChange={v => configSet("login", v)} value={api.adminConfig.login}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={"Registration"}>
                        <Form>
                            <div className={"absfg"}>
                                Enable or disable site registration
                                <Radio onChange={v => configSet("registration", v)} value={api.adminConfig.registration}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                    <Section title={"Main Game"}>
                        <Form>
                            <div className={"absfg"}>
                                Scoring
                                <Radio onChange={v => configSet("scoring", v)} value={api.adminConfig.scoring}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                            <div className={"absfg"}>
                                Flag Submission
                                <Radio onChange={v => configSet("flags_on", v)} value={api.adminConfig.flags_on}
                                    options={[["Enabled", true], ["Disabled", false]]} />
                            </div>
                        </Form>
                    </Section>
                </> : <Spinner />}
            </AdminSection>
            <AdminSection title={"Service Status"}>
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
            </AdminSection>
            <AdminSection title={"Announcements"}>
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
            </AdminSection>
            <AdminSection title={"Members"}>
                {api.allUsersAdmin ? <>
                    <Section title={"Admins"}>
                        {api.allUsersAdmin.filter(i => i.is_admin).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                    <Section title={"Standard Users"}>
                        {api.allUsersAdmin.filter(i => !i.is_admin).map(i =>
                            <MemberCard key={i.id} data={i} />
                        )}
                    </Section>
                </> : <Spinner />}
            </AdminSection>
            <AdminSection title={"Teams"}>
                {api.allTeamsAdmin ? <>
                    <Section title={"All Teams"}>
                        {api.allTeamsAdmin.map(i =>
                            <TeamCard key={i.id} data={i} />
                        )}
                    </Section>
                </> : <Spinner />}
            </AdminSection>
        </AdminTabs>
    </Page>
}
