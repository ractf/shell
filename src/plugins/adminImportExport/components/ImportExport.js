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

import React, { useContext, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ENDPOINTS, createChallenge, newHint, newFile, reloadAll, createGroup, editChallenge } from "@ractf/api";
import { appContext } from "ractf";
import http from "@ractf/http";
import { Button, PageHead, Card, Row, Modal, Select, Badge, FormGroup, Input, Form, H6, Column } from "@ractf/ui-kit";
import { cleanFilename, downloadJSON, downloadCSV } from "@ractf/util/download";
import { useCategories, useExperiment } from "@ractf/util/hooks";


const PackCreator = ({ close }) => {
    const [selected, setSelected] = useState([]);
    const categories = useCategories();
    const formValues = useRef();

    const options = categories.map(i => i.challenges).flat().map(
        i => ({ key: i.id, value: i.name })
    );

    const select = useCallback((key) => {
        const value = (() => {
            for (const i of options)
                if (i.key === key)
                    return i.value;
        })();
        setSelected(oldSelected => {
            for (const i of oldSelected)
                if (i.key === key) return oldSelected;
            return [...oldSelected, { key, value }];
        });
    }, [options]);
    const remove = (key) => {
        return () => {
            setSelected(oldSelected => oldSelected.filter(i => i.key !== key));
        };
    };
    const create = useCallback(() => {
        const allChallenges = categories.map(i => i.challenges).flat();
        downloadJSON({
            name: formValues.current.name,
            description: formValues.current.description,
            challenges: allChallenges.filter(i => (
                selected.filter(j => j.key === i.id).length !== 0
            )).map(i => i.toJSON()),
        }, cleanFilename(formValues.current.name));
        if (close)
            close();
    }, [categories, selected, close]);

    return <Modal header={"Create Challenge Pack"} buttons={<>
        <Button onClick={close} lesser warning>Cancel</Button>
    </>} onClose={close} okay={"Download Pack"} onOkay={create} cancel={false}>
        <H6>Settings:</H6>
        <Form valuesRef={formValues}>
            <FormGroup htmlFor={"name"} label={"Name"}>
                <Input name={"name"} placeholder={"Name"} />
            </FormGroup>
            <FormGroup htmlFor={"description"} label={"Description"}>
                <Input name={"description"} rows={3} placeholder={"Description"} />
            </FormGroup>
        </Form>
        <Row>
            <H6>Challenges:</H6>
        </Row>
        <Row>{selected.map(i => (
            <Badge key={i.key} onClose={remove(i.key)} x>{i.value}</Badge>
        ))}</Row>
        <Row>
            <Select onChange={select} options={
                options.filter(i => selected.filter(j => j.key === i.key).length === 0)
            } hasFilter />
        </Row>
    </Modal>;
};


export default () => {
    const app = useContext(appContext);
    const { t } = useTranslation();
    const categories = useCategories();
    const [importEntire] = useExperiment("importEntire");

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
            {
                name: "cat", options: categories.map(i => ({ key: i.id, value: i.name })),
                hasFilter: true
            }
        ]).then(({ cat }) => {
            if (typeof cat === "number") {
                const category = categories.filter(i => i.id === cat)[0].toJSON();
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
                ), hasFilter: true
            }
        ]).then(({ chal }) => {
            if (typeof chal === "number") {
                let challenge = categories.map(i => i.challenges).flat().filter(i => i.id === chal)[0];
                challenge = cleanChallenge(challenge.toJSON());
                if (!challenge) return app.alert("Something went wrong while trying to export");
                downloadJSON(challenge, challenge.name);
            }
        });
    };

    const fullyPaginate = async (route, callback) => {
        let results = [];
        let data;

        do {
            data = await http.get(route, null, { "X-Exporting": "true" });
            results = [...results, ...data.results];
            if (callback) callback(results);
            route = data.next;
        } while (route);

        return results;
    };

    const exportPlayers = () => {
        app.showProgress("Exporting users", 0);

        http.get(ENDPOINTS.STATS).then(({ user_count }) => {
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
            }).catch(e => app.alert(http.getError(e)));
        });
    };

    const exportTeams = () => {
        app.showProgress("Exporting teams", 0);

        http.get(ENDPOINTS.STATS).then(({ team_count }) => {
            if (team_count === 0) return app.alert("No teams to export!");

            const every = data => app.showProgress(
                `Exporting teams: ${data.length}/${team_count}`,
                data.length / team_count
            );
            every([]);

            fullyPaginate(ENDPOINTS.TEAM, every).then(data => {
                data = data.map(i => [
                    i.id, i.name, i.is_visible,
                    i.owner, i.password, i.members,
                    i.solves ? i.solves.filter(Boolean).map(j => j.id).join(",") : ""
                ]);
                app.showProgress(null);
                downloadCSV([[
                    "id", "name", "visible", "owner", "password", "members", "solves"
                ], ...data], "teams");
            }).catch(e => app.alert(http.getError(e)));
        });
    };

    const exportLeaderboard = () => {
        const progress = [false, false];
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
        return createChallenge({
            id: cat, name: data.name,
            description: data.description,
            challenge_type: data.challenge_type,
            // TODO: This, but better
            challenge_metadata: data.challenge_metadata,
            auto_unlock: data.auto_unlock,
            flag_type: data.flag_type,
            author: data.author,
            score: data.score,
            flag_metadata: data.flag_metadata,
            tags: data.tags || []
        }).then(async (chal) => {
            await Promise.all([
                ...data.hints.map(hint => hint.text && newHint(
                    chal.id, hint.name, hint.penalty, hint.text
                )),
                ...data.files.map(file => newFile(
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
                        reloadAll();
                        app.alert("Imported challenge!");
                    }).catch(e => {
                        reloadAll();
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
            createGroup(data.name, data.description, data.contained_type, data.metadata)
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
                        editChallenge({
                            ...challenge_map[chal.id],
                            unlocks: chal.unlocks.map(i => challenge_map[i].id)
                        }).then(() => {
                            progress += 1 / data.challenges.length;
                            app.showProgress("Linking challenges...", progress);
                        })
                    )));
                }).then(() => {
                    reloadAll();
                    app.alert("Imported category!");
                }).catch(e => {
                    reloadAll();
                    app.alert("Failed to import category:\n" + http.getError(e));
                    console.error(e);
                });
        });
    };
    const [isCreatePack, setCreatePack] = useState(false);
    const createPack = useCallback(() => {
        setCreatePack(true);
    }, []);
    const stopCreatePack = useCallback(() => {
        setCreatePack(false);
    }, []);

    return <>
        <PageHead title={t("admin.import_and_export")} />

        {isCreatePack && <PackCreator close={stopCreatePack} />}

        <Column>
            <Row>
                <Card lesser header={t("admin.import")}>
                    <Row centre>
                        {importEntire && <Button disabled danger>{t("admin.import_ctf")}</Button>}
                        <Button onClick={importCategory}>{t("admin.import_cat")}</Button>
                        <Button onClick={importChal}>{t("admin.import_chal")}</Button>
                    </Row>
                </Card>
            </Row>
            <Row>
                <Card lesser header={t("admin.export")}>
                    <Row centre>
                        {importEntire && <Button onClick={exportCTF}>{t("admin.export_ctf")}</Button>}
                        <Button onClick={exportCat}>{t("admin.export_cat")}</Button>
                        <Button onClick={exportChal}>{t("admin.export_chal")}</Button>
                        <Button onClick={createPack}>Create challenge pack</Button>
                    </Row>
                    <Row centre>
                        <Button onClick={exportLeaderboard}>{t("admin.export_sb")}</Button>
                        <Button onClick={exportPlayers}>{t("admin.export_players")}</Button>
                        <Button onClick={exportTeams}>{t("admin.export_teams")}</Button>
                    </Row>
                </Card>
            </Row>
        </Column>
    </>;
};