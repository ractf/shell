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

import React, { useContext, useState, useRef } from "react";
import { FiEdit2, FiTrash, FiPlus, FiCrosshair } from "react-icons/fi";

import * as http from "@ractf/util/http";
import { usePaginated } from "@ractf/util/http";
import { ENDPOINTS } from "@ractf/api";
import { registerPlugin } from "@ractf/plugins";
import {
    Page, PageHead, Grid, Button, Modal, Input, Form, HR,
    UiKitModals, Container, Checkbox
} from "@ractf/ui-kit";


const CMSAdmin = () => {
    const [groups,      , gRefresh] = usePaginated(ENDPOINTS.LEADERBOARD_GROUPS);
    const modals = useContext(UiKitModals);
    const [editingGroup, setEditingGroup] = useState(false);
    const formSubmit = useRef();

    const removeGroup = (group) => {
        modals.promptConfirm(<>Are you sure you want to remove <code>{group.name}</code>?</>).then(() => {
            http.delete_("/team/groups/" + group.id).then(() => {
                gRefresh();
            }).catch(() => {
                modals.alert("Failed to remove group");
            });
        }).catch();
    };
    const editGroup = (group) => {
        setEditingGroup(group);
    };
    const addNew = () => {
        setEditingGroup({ name: "", description: "", is_self_assignable: true, has_own_leaderboard: true });
    };
    const postSubmit = ({ resp }) => {
        gRefresh();
        setEditingGroup(false);
    };

    return <Page>
        {editingGroup !== false ?
            <Modal header={"Editing Group"} onClose={() => setEditingGroup(false)} onConfirm={() => formSubmit.current()}>
                <Form postSubmit={postSubmit}
                    action={(typeof editingGroup.id !== "undefined") ? `/team/groups/${editingGroup.id}/` : "/team/groups/"}
                    method={(typeof editingGroup.id !== "undefined") ? "PATCH" : "POST"} submitRef={formSubmit}
                >
                    <Form.Row>
                        <Form.Group label={"Name"}>
                            <Input placeholder={"Name"} name={"name"} val={editingGroup.name} required />
                        </Form.Group>
                        {(typeof editingGroup.id !== "undefined") && <Form.Group label={"Group ID"} htmlFor={"id"}>
                            <Input val={editingGroup.id} name={"id"} readonly />
                        </Form.Group>}
                    </Form.Row>
                    <Form.Group label={"Description (for admin reference)"}>
                        <Input placeholder={"Description"} name={"description"} val={""} />
                    </Form.Group>
                    <Form.Group label={"Self-assignable on team create?"}>
                        <Checkbox name={"is_self_assignable"} val={editingGroup.is_self_assignable} />
                    </Form.Group>
                    <Form.Group label={"Has its own leaderboard page?"}>
                        <Checkbox name={"has_own_leaderboard"} val={editingGroup.has_own_leaderboard} />
                    </Form.Group>
                </Form>
            </Modal> : null
        }
        <PageHead>Leaderboard Groups</PageHead>
        <Grid headings={["Name", "Has own leaderboard group", "Self-assignable", "Actions"]} data={[...groups.data.map(i => [
            i.name, i.has_own_leaderboard ? "Yes" : "No", i.is_self_assignable ? "Yes" : "No", <Container toolbar>
                <Button tiny warning Icon={FiEdit2} onClick={() => editGroup(i)} />
                <Button tiny danger Icon={FiTrash} onClick={() => removeGroup(i)} />
            </Container>
        ]), [<Button tiny Icon={FiPlus} onClick={addNew}>Add group</Button>, null, null]]} />
    </Page>;
};

export default () => {
    registerPlugin("adminPage", "leaderboard_groups", {
        component: CMSAdmin,
        sidebar: "Leaderboard Groups",
        Icon: FiCrosshair,
    });
};
