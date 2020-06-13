import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';

import { Button, SBTSection, Section, FlexRow } from "@ractf/ui-kit";
import { apiContext, apiEndpoints, appContext, ENDPOINTS } from "ractf";


export default () => {
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
                let cell = JSON.stringify(cellData ? cellData.toString() : "");
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

    const fullyPaginate = async (route, callback) => {
        let results = [];
        let data;

        do {
            data = (await endpoints.get(route, { "X-Exporting": "true" })).d;
            results = [...results, ...data.results];
            if (callback) callback(results);
            route = data.next;
        } while (route);

        return results;
    };

    const exportPlayers = () => {
        app.showProgress("Exporting users", 0);

        endpoints.get(ENDPOINTS.STATS).then(({ d: { user_count } }) => {
            if (user_count === 0) return app.alert("No users to export!");

            const every = data => app.showProgress(
                `Exporting users: ${data.length}/${user_count}`,
                data.length / user_count
            );
            every([]);

            fullyPaginate(ENDPOINTS.USER, every).then(data => {
                data = data.map(i => [
                    i.id, i.username, i.email, i.email_verified, i.date_joined,
                    i.is_active, i.is_visible, i.is_staff,
                    i.team, i.points, i.leaderboard_points,
                    i.reddit, i.twitter, i.discord, i.discordid,
                    i.bio,
                    i.solves ? i.solves.filter(Boolean).map(j => j.id).join(",") : ""
                ]);
                app.showProgress(null);
                downloadCSV([[
                    "id", "username", "email", "email verified", "date joined",
                    "active", "visible", "staff",
                    "team id", "points", "leaderboard points",
                    "reddit", "twitter", "discord", "discord id",
                    "bio", "solves"
                ], ...data], "players");
            }).catch(e => app.alert(endpoints.getError(e)));
        });
    };

    const exportTeams = () => {
        app.showProgress("Exporting teams", 0);

        endpoints.get(ENDPOINTS.STATS).then(({ d: { team_count } }) => {
            if (team_count === 0) return app.alert("No teams to export!");

            const every = data => app.showProgress(
                `Exporting teams: ${data.length}/${team_count}`,
                data.length / team_count
            );
            every([]);

            fullyPaginate(ENDPOINTS.TEAM, every).then(data => {
                data = data.map(i => [
                    i.id, i.name, i.is_visible,
                    i.owner, i.password,
                    i.members ? i.members.map(j => j.id).join(",") : "",
                    i.solves ? i.solves.filter(Boolean).map(j => j.id).join(",") : ""
                ]);
                app.showProgress(null);
                downloadCSV([[
                    "id", "name", "visible", "owner", "password", "members", "solves"
                ], ...data], "teams");
            }).catch(e => app.alert(endpoints.getError(e)));
        });
    };

    const exportLeaderboard = () => {
        let progress = [false, false];
        app.showProgress("Exporting...", 0);
        
        fullyPaginate(ENDPOINTS.LEADERBOARD_TEAM).then(data => {
            data = data.map(i => [
                i.name, i.leaderboard_points
            ]);

            progress[0] = true;
            if (progress[1]) app.showProgress(null);
            else app.showProgress("Exporting...", .5);

            downloadCSV([[
                "team name", "points"
            ], ...data], "team leaderboard");
        });
        fullyPaginate(ENDPOINTS.LEADERBOARD_USER).then(data => {
            data = data.map(i => [
                i.username, i.leaderboard_points
            ]);

            progress[1] = true;
            if (progress[0]) app.showProgress(null);
            else app.showProgress("Exporting...", .5);

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