import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import useReactRouter from "../../useReactRouter";
import DatePicker from "react-datepicker";


import {
    Page, Form, Input, Button, Radio, Spinner, SBTSection, Section, apiContext,
    apiEndpoints, appContext, useApi, ENDPOINTS, useFullyPaginated, FlexRow,
    Tree, TreeWrap, TreeValue
} from "ractf";

import "react-datepicker/dist/react-datepicker.css";


const AdminCardSection = ({ children, name }) => {
    return <div className={"absfg"}>
        <div>{name}</div>
        {children}
    </div>;
};



const MemberCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const api = useContext(apiContext);
    const [rerender, setRerender] = useState(0);

    const configSet = (key, value) => {
        let initial = data[key];
        data[key] = value;
        setRerender(rerender + 1);
        endpoints.modifyUser(data.id, { [key]: value }).then(() => {
        }).catch(e => {
            data[key] = initial;
            setRerender(rerender + 1);
            app.alert(endpoints.getError(e));
        });
    };
    const set = key => value => configSet(key, value);

    return <Tree name={data.username}>
        <TreeValue name={"id"} value={data.id} />
        <TreeValue name={"enabled"} value={data.is_active} setValue={!data.is_staff && set("is_active")} />
        <TreeValue name={"visible"} value={data.is_visible} setValue={set("is_visible")} />
        <TreeValue name={"is_staff"} value={data.is_staff} setValue={data.id !== api.user.id && set("is_staff")} />
        <TreeValue name={"points"} value={data.points} setValue={set("points")} />
        <Tree name={"metadata"}>
            <TreeValue name={"email"} value={data.email} setValue={set("email")} />
            <TreeValue name={"email_verified"} value={data.email_verified} setValue={set("email_verified")} />
            <TreeValue name={"bio"} value={data.bio} setValue={set("bio")} />
            <TreeValue name={"discord"} value={data.discord} setValue={set("discord")} />
            <TreeValue name={"discord_id"} value={data.discordid} setValue={set("discordid")} />
            <TreeValue name={"twitter"} value={data.twitter} setValue={set("twitter")} />
            <TreeValue name={"reddit"} value={data.reddit} setValue={set("reddit")} />
        </Tree>
        <Tree name={"solves"}>
            {data.solves.map(i => <Tree key={i.id} name={i.challenge_name}>
                <TreeValue name={"points"} value={i.points} />
                <TreeValue name={"first_blood"} value={i.first_blood} />
                <TreeValue name={"timestamp"} value={i.timestamp} />
            </Tree>)}
        </Tree>
    </Tree>;
};


const TeamCard = ({ data }) => {
    const endpoints = useContext(apiEndpoints);
    const app = useContext(appContext);
    const [rerender, setRerender] = useState(0);

    const configSet = (key, value) => {
        let initial = data[key];
        data[key] = value;
        setRerender(rerender + 1);
        endpoints.modifyTeam(data.id, { [key]: value }).then(() => {
        }).catch(e => {
            data[key] = initial;
            setRerender(rerender + 1);
            app.alert(endpoints.getError(e));
        });
    };
    const set = key => value => configSet(key, value);
    let points = 0;
    data.members.forEach(i => points += i.points);

    return <Tree name={data.name}>
        <TreeValue name={"id"} value={data.id} />
        <TreeValue name={"visible"} value={data.is_visible} setValue={set("is_visible")} />
        <TreeValue name={"points"} value={points} />
        <TreeValue name={"owner_id"} value={data.owner} setValue={set("owner")} />
        <Tree name={"metadata"}>
            <TreeValue name={"password"} value={data.password} setValue={set("password")} />
            <TreeValue name={"description"} value={data.description} setValue={set("description")} />
        </Tree>
        <Tree name={"members"}>
            {data.members.map(i => <Tree key={i.id} name={i.username}>
                <TreeValue name={"id"} value={i.id} />
                <TreeValue name={"points"} value={i.points} />
            </Tree>)}
        </Tree>
        <Tree name={"solves"}>
            {data.solves.map(i => <Tree key={i.id} name={i.challenge_name}>
                <TreeValue name={"solved_by"} value={i.solved_by_name} />
                <TreeValue name={"points"} value={i.points} />
                <TreeValue name={"first_blood"} value={i.first_blood} />
                <TreeValue name={"timestamp"} value={i.timestamp} />
            </Tree>)}
        </Tree>
    </Tree>;
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
        style={{ zIndex: 50 }}
        name={name} />;
};

const ImportExport = () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const { t } = useTranslation();

    const downloadData = (data, filename, mimetype) => {
        let blob = new Blob([data], { type: `${mimetype};charset=utf-8;` });
        if (navigator.msSaveBlob)
            return navigator.msSaveBlob(blob, filename);

        let elem = document.createElement("a");
        elem.style = "display: none";
        elem.href = URL.createObjectURL(blob);
        elem.target = "_blank";
        elem.setAttribute("download", filename);
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    };
    const downloadJSON = (data, filename) => {
        downloadData(JSON.stringify(data, null, 2), filename + ".json", "application/json");
    };
    const downloadCSV = (data, filename) => {
        let csv = "";
        data.forEach(rowData => {
            let row = "";
            rowData.forEach(cellData => {
                if (row) row += ",";
                let cell = JSON.stringify(cellData.toString());
                if (cell[1] === "=")
                    cell = `=${cell}`;
                row += cell;
            });
            csv += row + "\n";
        });
        downloadData(csv, filename + ".csv", "text/csv");
    };

    const stripKeys = (orig, keys) => (
        Object.keys(orig).filter(
            key => !keys.includes(key)
        ).reduce((obj, key) => {
            obj[key] = orig[key];
            return obj;
        }, {})
    );
    const cleanChallenge = (chal) => {
        chal = stripKeys(chal, [
            "solved", "unlocked", "first_blood",
            "first_blood_name", "solve_count",
        ]);
        chal.hints = chal.hints.map(hint => stripKeys(hint, ["used", "challenge"]));
        chal.files = chal.files.map(file => stripKeys(file, ["challenge"]));
        return chal;
    };

    const exportCTF = () => {
        downloadJSON(api.challenges.map(i => ({ ...i, challenges: i.challenges.map(cleanChallenge) })), "challenges");
    };

    const exportCat = () => {
        app.promptConfirm({ message: "Select category", small: true }, [
            { name: "cat", options: api.challenges.map(i => ({ key: i.id, value: i.name })) }
        ]).then(({ cat }) => {
            if (typeof cat === "number") {
                let category = api.challenges.filter(i => i.id === cat)[0];
                category.challenges = category.challenges.map(cleanChallenge);
                if (!category) return app.alert("Something went wrong while trying to export");
                downloadJSON(category, category.name);
            }
        });
    };
    const exportChal = () => {
        app.promptConfirm({ message: "Select challenge", small: true }, [
            {
                name: "chal", options: api.challenges.map(i => i.challenges).flat().map(
                    i => ({ key: i.id, value: i.name })
                )
            }
        ]).then(({ chal }) => {
            if (typeof chal === "number") {
                let challenge = api.challenges.map(i => i.challenges).flat().filter(i => i.id === chal)[0];
                challenge = cleanChallenge(challenge);
                if (!challenge) return app.alert("Something went wrong while trying to export");
                downloadJSON(challenge, challenge.name);
            }
        });
    };

    const fullyPaginate = async route => {
        let page = 0;
        let results = [];
        let data;

        do {
            let path = (page === 0) ? route : (route + "?page=" + page);

            data = (await endpoints.get(path)).d;
            results = [...results, ...data.results];
            page++;
        } while (data.next);

        return results;
    };

    const exportPlayers = () => {
        fullyPaginate(ENDPOINTS.USER).then(data => {
            data = data.map(i => [
                i.id, i.username, i.email, i.email_verified, i.date_joined,
                i.is_active, i.is_visible, i.is_staff,
                i.team, i.points, i.leaderboard_points,
                i.reddit, i.twitter, i.discord, i.discordid,
                i.bio,
                i.solves.map(j => j.id).join(",")
            ]);
            downloadCSV([[
                "id", "username", "email", "email verified", "date joined",
                "active", "visible", "staff",
                "team id", "points", "leaderboard points",
                "reddit", "twitter", "discord", "discord id",
                "bio", "solves"
            ], ...data], "players");
        }).catch(e => app.alert(endpoints.getError(e)));
    };

    const exportTeams = () => {
        fullyPaginate(ENDPOINTS.TEAM).then(data => {
            data = data.map(i => [
                i.id, i.name, i.is_visible,
                i.owner, i.password,
                i.members.map(j => j.id).join(","),
                i.solves.map(j => j.id).join(",")
            ]);
            downloadCSV([[
                "id", "name", "visible", "owner", "password", "members", "solves"
            ], ...data], "teams");
        }).catch(e => app.alert(endpoints.getError(e)));
    };

    const exportLeaderboard = () => {
        fullyPaginate(ENDPOINTS.LEADERBOARD_TEAM).then(data => {
            data = data.map(i => [
                i.name, i.leaderboard_points
            ]);
            downloadCSV([[
                "team name", "points"
            ], ...data], "team leaderboard");
        });
        fullyPaginate(ENDPOINTS.LEADERBOARD_USER).then(data => {
            data = data.map(i => [
                i.username, i.leaderboard_points
            ]);
            downloadCSV([[
                "username", "points"
            ], ...data], "user leaderboard");
        });
    };

    const askOpen = (accept) => {
        return new Promise(resolve => {
            let elem = document.createElement("input");
            elem.setAttribute("type", "file");
            elem.setAttribute("accept", accept);
            elem.style = "display: none";
            elem.onchange = () => {
                if (elem.files.length > 0)
                    resolve(elem.files[0]);
            };
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        });
    };
    const askOpenJSON = () => {
        return new Promise(resolve => {
            askOpen("application/json").then(file => {
                file.text().then(text => {
                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        return app.alert("Failed to parse JSON");
                    }
                    resolve(data);
                });
            });
        });
    };

    const validate_challenge = (data) => {
        return (
            data.hasOwnProperty("name") &&
            data.hasOwnProperty("description") &&
            data.hasOwnProperty("challenge_type") &&
            data.hasOwnProperty("challenge_metadata") &&
            data.hasOwnProperty("flag_type") &&
            data.hasOwnProperty("author") &&
            data.hasOwnProperty("auto_unlock") &&
            data.hasOwnProperty("score") &&
            data.hasOwnProperty("unlocks") &&
            data.hasOwnProperty("flag_metadata") &&
            data.hasOwnProperty("hints") &&
            data.hasOwnProperty("files")
        );
    };
    const validate_category = (data) => {
        return (
            data.hasOwnProperty("name") &&
            data.hasOwnProperty("contained_type") &&
            data.hasOwnProperty("description") &&
            data.hasOwnProperty("challenges") &&
            data.challenges.every(i => (
                i.hasOwnProperty("id") &&
                validate_challenge(i) &&
                // Ensure we aren't referencing any challenges outside of the
                // category being imported, as the IDs won't match up.
                i.unlocks.every(j => data.challenges.map(k => k.id).indexOf(j) !== -1)
            ))
        );
    };

    const importChallengeData = (cat, data) => {
        return endpoints.createChallenge({
            id: cat, name: data.name,
            description: data.description,
            challenge_type: data.challenge_type,
            // TODO: This, but better
            challenge_metadata: data.challenge_metadata,
            autoUnlock: data.auto_unlock,
            flag_type: data.flag_type,
            author: data.author,
            score: data.score,
            flag_metadata: data.flag_metadata,
        }).then(({ d }) => d).then(async (chal) => {
            await Promise.all([
                ...data.hints.map(hint => endpoints.newHint(
                    chal.id, hint.name, hint.penalty, hint.text
                )),
                ...data.files.map(file => endpoints.newFile(
                    chal.id, file.name, file.url, file.size
                ))
            ]);
            return chal;
        });
    };

    const importChal = () => {
        askOpenJSON().then(data => {
            if (!validate_challenge(data))
                return app.alert("Invalid challenge data");

            app.promptConfirm({ message: "Select category to import into", small: true }, [
                {
                    name: "cat", options: api.challenges.map(
                        i => ({ key: i.id, value: i.name })
                    )
                }
            ]).then(({ cat }) => {
                if (typeof cat === "number") {
                    importChallengeData(cat, data).then(() => {
                        endpoints._reloadCache();
                        app.alert("Imported challenge!");
                    }).catch(e => {
                        endpoints._reloadCache();
                        app.alert("Failed to import challenge:\n" + endpoints.getError(e));
                        console.error(e);
                    });
                }
            });
        });
    };

    const importCategory = () => {
        askOpenJSON().then(data => {
            if (!validate_category(data))
                return app.alert("Invalid category data");
            app.showProgress("Creating category...", .5);
            endpoints.createGroup(data.name, data.description, data.contained_type)
                .then(({ d }) => d)
                .then(async ({ id }) => {
                    let challenge_map = {};
                    let progress = 0;

                    await Promise.all(data.challenges.map(chal => (importChallengeData(id, chal).then(cdat => {
                        challenge_map[chal.id] = cdat;
                        progress += 1 / data.challenges.length;
                        app.showProgress("Creating challenges...", progress);
                    }))));
                    return challenge_map;
                }).then(challenge_map => {
                    let progress = 0;
                    return Promise.all(data.challenges.map(chal => (
                        endpoints.editChallenge({
                            ...challenge_map[chal.id],
                            unlocks: chal.unlocks.map(i => challenge_map[i].id)
                        }).then(() => {
                            progress += 1 / data.challenges.length;
                            app.showProgress("Linking challenges...", progress);
                        })
                    )));
                }).then(() => {
                    endpoints._reloadCache();
                    app.alert("Imported category!");
                }).catch(e => {
                    endpoints._reloadCache();
                    app.alert("Failed to import category:\n" + endpoints.getError(e));
                    console.error(e);
                });
        });
    };

    return <SBTSection title={t("admin.import_and_export")}>
        <Section title={t("admin.import")}>
            <FlexRow>
                <Button disabled warning>{t("admin.import_ctf")}</Button>
                <Button click={importCategory}>{t("admin.import_cat")}</Button>
                <Button click={importChal}>{t("admin.import_chal")}</Button>
            </FlexRow>
        </Section>
        <Section title={t("admin.export")}>
            <FlexRow>
                <Button click={exportCTF}>{t("admin.export_ctf")}</Button>
                <Button click={exportCat}>{t("admin.export_cat")}</Button>
                <Button click={exportChal}>{t("admin.export_chal")}</Button>
            </FlexRow>
            <FlexRow>
                <Button click={exportLeaderboard}>{t("admin.export_sb")}</Button>
                <Button click={exportPlayers}>{t("admin.export_players")}</Button>
                <Button click={exportTeams}>{t("admin.export_teams")}</Button>
            </FlexRow>
        </Section>
    </SBTSection>;
};

export default () => {
    const endpoints = useContext(apiEndpoints);
    const api = useContext(apiContext);
    const app = useContext(appContext);
    const [adminConfig, setAdminConfig] = useState(null);
    const { t } = useTranslation();

    const { data: allUsersAdmin } = useFullyPaginated(ENDPOINTS.USER);
    const { data: allTeamsAdmin } = useFullyPaginated(ENDPOINTS.TEAM);
    const [adminConfig_] = useApi(ENDPOINTS.CONFIG);

    const { match } = useReactRouter();
    if (!match) return null;
    const page = match.params.page;

    const configSet = (key, value) => {
        endpoints.setConfigValue(key, value).then(() => {
            if (api.config)
                api.config[key] = value;
            setAdminConfig({ ...adminConfig, key: value });
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
            content = <SBTSection title={t("admin.event")}>
                {adminConfig ? <>
                    <Section title={t("admin.start_stop")}>
                        <AdminCardSection name={t("admin.start_desc")}>
                            <Button>{t("admin.start")}</Button>
                        </AdminCardSection>
                        <AdminCardSection name={t("admin.stop_desc")}>
                            <Button>{t("admin.stop")}</Button>
                        </AdminCardSection>

                    </Section>
                    <Section title={t("admin.auto_time")}>
                        <div className={"formWrapper"}>
                            <div className={"absfg"}>
                                <label htmlFor={"regStartTime"}>{t("admin.reg_start_time")}</label>
                                <DatePick initial={adminConfig.register_start_time}
                                    configSet={configSet} name={"regStartTime"}
                                    configKey={"register_start_time"} />
                            </div>
                            <div className={"absfg"}>
                                <label htmlFor={"eventStartTime"}>{t("admin.start_time")}</label>
                                <DatePick initial={adminConfig.start_time}
                                    configSet={configSet} name={"eventStartTime"}
                                    configKey={"start_time"} />
                            </div>
                            <div className={"absfg"}>
                                <label htmlFor={"eventEndTime"}>{t("admin.stop_time")}</label>
                                <DatePick initial={adminConfig.end_time}
                                    configSet={configSet} name={"eventEndTime"}
                                    configKey={"end_time"} />
                            </div>
                        </div>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "config":
            content = <SBTSection title={t("admin.configuration")}>
                {adminConfig ? <>
                    <Section title={t("admin.login")}>
                        <AdminCardSection name={t("admin.enable_login")}>
                            <Radio onChange={v => configSet("login", v)} value={adminConfig.login}
                                options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                        </AdminCardSection>
                    </Section>
                    <Section title={t("admin.reg")}>
                        <AdminCardSection name={t("admin.enable_reg")}>
                            <Radio onChange={v => configSet("register", v)} value={adminConfig.register}
                                options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                        </AdminCardSection>
                    </Section>
                    <Section title={t("admin.main_game")}>
                        <AdminCardSection name={t("admin.scoring")}>
                            <Radio onChange={v => configSet("scoring", v)} value={adminConfig.scoring}
                                options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                        </AdminCardSection>
                        <AdminCardSection name={t("admin.flags")}>
                            <Radio onChange={v => configSet("flags", v)} value={adminConfig.flags}
                                options={[[t("admin.enabled"), true], [t("admin.disabled"), false]]} />
                        </AdminCardSection>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "port":
            content = <ImportExport />;
            break;
        case "service":
            content = <SBTSection title={t("admin.status")}>
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
                        <TreeWrap>
                            {allUsersAdmin.filter(i => i.is_staff).map(i =>
                                <MemberCard key={i.id} data={i} />
                            )}
                        </TreeWrap>
                    </Section>
                    <Section title={t("admin.users")}>
                        <TreeWrap>
                            {allUsersAdmin.filter(i => !i.is_staff).map(i =>
                                <MemberCard key={i.id} data={i} />
                            )}
                        </TreeWrap>
                    </Section>
                </> : <Spinner />}
            </SBTSection>;
            break;
        case "teams":
            content = <SBTSection title={t("admin.teams")}>
                {allTeamsAdmin ? <>
                    <Section title={t("admin.all_teams")}>
                        <TreeWrap>
                            {allTeamsAdmin.map(i =>
                                <TeamCard key={i.id} data={i} />
                            )}
                        </TreeWrap>
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
