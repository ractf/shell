import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { api, http, appContext } from "ractf";
import { Button, PageHead, Card, Row } from "@ractf/ui-kit";


export default () => {
    const app = useContext(appContext);
    const { t } = useTranslation();
    const categories = useSelector(state => state.challenges?.categories);

    const downloadData = (data, filename, mimetype) => {
        const blob = new Blob([data], { type: `${mimetype};charset=utf-8;` });
        if (navigator.msSaveBlob)
            return navigator.msSaveBlob(blob, filename);

        const elem = document.createElement("a");
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
        downloadJSON(categories.map(i => ({ ...i, challenges: i.challenges.map(cleanChallenge) })), "challenges");
    };

    const exportCat = () => {
        app.promptConfirm({ message: "Select category", small: true }, [
            { name: "cat", options: categories.map(i => ({ key: i.id, value: i.name })) }
        ]).then(({ cat }) => {
            if (typeof cat === "number") {
                const category = categories.filter(i => i.id === cat)[0];
                category.challenges = category.challenges.map(cleanChallenge);
                if (!category) return app.alert("Something went wrong while trying to export");
                downloadJSON(category, category.name);
            }
        });
    };
    const exportChal = () => {
        app.promptConfirm({ message: "Select challenge", small: true }, [
            {
                name: "chal", options: categories.map(i => i.challenges).flat().map(
                    i => ({ key: i.id, value: i.name })
                )
            }
        ]).then(({ chal }) => {
            if (typeof chal === "number") {
                let challenge = categories.map(i => i.challenges).flat().filter(i => i.id === chal)[0];
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
            const path = (page === 0) ? route : (route + "?page=" + page);

            data = await http.get(path);
            results = [...results, ...data.results];
            page++;
        } while (data.next);

        return results;
    };

    const exportPlayers = () => {
        fullyPaginate(api.ENDPOINTS.USER).then(data => {
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
        }).catch(e => app.alert(http.getError(e)));
    };

    const exportTeams = () => {
        fullyPaginate(api.ENDPOINTS.TEAM).then(data => {
            data = data.map(i => [
                i.id, i.name, i.is_visible,
                i.owner, i.password,
                i.members.map(j => j.id).join(","),
                i.solves.map(j => j.id).join(",")
            ]);
            downloadCSV([[
                "id", "name", "visible", "owner", "password", "members", "solves"
            ], ...data], "teams");
        }).catch(e => app.alert(http.getError(e)));
    };

    const exportLeaderboard = () => {
        fullyPaginate(api.ENDPOINTS.LEADERBOARD_TEAM).then(data => {
            data = data.map(i => [
                i.name, i.leaderboard_points
            ]);
            downloadCSV([[
                "team name", "points"
            ], ...data], "team leaderboard");
        });
        fullyPaginate(api.ENDPOINTS.LEADERBOARD_USER).then(data => {
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
            const elem = document.createElement("input");
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
        return api.createChallenge({
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
        }).then.then(async (chal) => {
            await Promise.all([
                ...data.hints.map(hint => api.newHint(
                    chal.id, hint.name, hint.penalty, hint.text
                )),
                ...data.files.map(file => api.newFile(
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
                    name: "cat", options: categories.map(
                        i => ({ key: i.id, value: i.name })
                    )
                }
            ]).then(({ cat }) => {
                if (typeof cat === "number") {
                    importChallengeData(cat, data).then(() => {
                        api.reloadAll();
                        app.alert("Imported challenge!");
                    }).catch(e => {
                        api.reloadAll();
                        app.alert("Failed to import challenge:\n" + http.getError(e));
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
            api.createGroup(data.name, data.description, data.contained_type)
                .then(async ({ id }) => {
                    const challenge_map = {};
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
                        api.editChallenge({
                            ...challenge_map[chal.id],
                            unlocks: chal.unlocks.map(i => challenge_map[i].id)
                        }).then(() => {
                            progress += 1 / data.challenges.length;
                            app.showProgress("Linking challenges...", progress);
                        })
                    )));
                }).then(() => {
                    api.reloadAll();
                    app.alert("Imported category!");
                }).catch(e => {
                    api.reloadAll();
                    app.alert("Failed to import category:\n" + http.getError(e));
                    console.error(e);
                });
        });
    };

    return <>
        <PageHead title={t("admin.import_and_export")} />
        <Row>
            <Card header={t("admin.import")}>
                <Row>
                    <Button disabled danger>{t("admin.import_ctf")}</Button>
                    <Button onClick={importCategory}>{t("admin.import_cat")}</Button>
                    <Button onClick={importChal}>{t("admin.import_chal")}</Button>
                </Row>
            </Card>
        </Row>
        <Row>
            <Card header={t("admin.export")}>
                <Row>
                    <Button onClick={exportCTF}>{t("admin.export_ctf")}</Button>
                    <Button onClick={exportCat}>{t("admin.export_cat")}</Button>
                    <Button onClick={exportChal}>{t("admin.export_chal")}</Button>
                </Row>
                <Row>
                    <Button onClick={exportLeaderboard}>{t("admin.export_sb")}</Button>
                    <Button onClick={exportPlayers}>{t("admin.export_players")}</Button>
                    <Button onClick={exportTeams}>{t("admin.export_teams")}</Button>
                </Row>
            </Card>
        </Row>
    </>;
};