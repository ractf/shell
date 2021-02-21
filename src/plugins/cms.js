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

import React, { useEffect, useContext, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { FiEdit2, FiTrash, FiPlus, FiFileText } from "react-icons/fi";

import * as http from "@ractf/util/http";
import { registerPlugin, registerReducer, registerMount } from "@ractf/plugins";
import {
    Markdown, Page, PageHead, Grid, Button, Row, Modal, Input, Form, HR,
    FormGroup, UiKitModals
} from "@ractf/ui-kit";

import Link from "components/Link";
import { store } from "store";


const INITIAL = {
    pages: [],
    cache: {}
};

const cmsReducer = (state = INITIAL, { type, payload }) => {
    switch (type) {
        case "SET_CMS_PAGES":
            return { ...state, pages: payload };
        default:
            return state;
    }
};

const CMSPage = React.memo(({ page }) => {
    if (page.title)
        document.title = page.title;

    return <Page>
        <Markdown LinkElem={Link} source={page.content} />
    </Page>;
});
CMSPage.displayName = "CMSPage";

const setPages = (pages) => {
    return { type: "SET_CMS_PAGES", payload: pages };
};

const CMSLoader = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        http.get("/pages").then((pages) => {
            dispatch(setPages(pages));
        });
    }, [dispatch]);
    return null;
};

const CMSAdmin = () => {
    const dispatch = useDispatch();
    const pages = useSelector(state => state.cms.pages);
    const modals = useContext(UiKitModals);
    const [editContent, setEditContent] = useState("");
    const [editingPage, setEditingPage] = useState(false);
    const formSubmit = useRef();

    const removePage = (page) => {
        modals.promptConfirm(<>Are you sure you want to remove <code>{page.title}</code>?</>).then(() => {
            http.delete_("/pages/" + page.id).then(() => {
                dispatch(setPages(pages.filter(i => i.id !== page.id)));
            }).catch(() => {
                modals.alert("Failed to remove page");
            });
        }).catch();
    };
    const editPage = (page) => {
        setEditContent(page.content);
        setEditingPage(page);
    };
    const onEditChange = ({ content }) => {
        setEditContent(content);
    };
    const addNew = () => {
        setEditingPage({ url: "", title: "", content: "" });
    };
    const postSubmit = ({ resp }) => {
        if (typeof editingPage.id === "undefined")
            dispatch(setPages([...pages, resp]));
        else
            dispatch(setPages(pages.map(i => i.id === resp.id ? resp : i)));
        setEditingPage(false);
    };
    const validator = ({ url }) => {
        return new Promise((resolve, reject) => {
            if (/^[/]*admin/.test(url))
                return reject({ url: "Overwriting admin pages is forbidden." });
            resolve();
        });
    };

    return <Page>
        {editingPage !== false ?
            <Modal header={"Editing Page"} onClose={() => setEditingPage(false)} onConfirm={() => formSubmit.current()}>
                <Form onChange={onEditChange} postSubmit={postSubmit} validator={validator}
                    action={(typeof editingPage.id !== "undefined") ? `/pages/${editingPage.id}/` : "/pages/"}
                    method={(typeof editingPage.id !== "undefined") ? "PATCH" : "POST"} submitRef={formSubmit}
                >
                    <FormGroup label={"URL"}>
                        <Input placeholder={"URL"} name={"url"} val={editingPage.url} required />
                    </FormGroup>
                    <FormGroup label={"Title"}>
                        <Input placeholder={"Title"} name={"title"} val={editingPage.title} required />
                    </FormGroup>
                    <FormGroup label={"Content (supports markdown and basic html)"}>
                        <Input placeholder={"Content"} name={"content"} rows={10}
                            val={editingPage.content} monospace required />
                    </FormGroup>

                    <HR />
                    <Markdown LinkElem={Link} source={editContent} />
                </Form>
            </Modal> : null
        }
        <PageHead>Custom Site Pages</PageHead>
        <Grid headings={["Title", "URL", "Actions"]} data={[...pages.map(i => [
            i.title, <Link to={i.url}>{i.url}</Link>, <Row>
                <Button tiny warning Icon={FiEdit2} onClick={() => editPage(i)} />
                <Button tiny danger Icon={FiTrash} onClick={() => removePage(i)} />
            </Row>
        ]), [<Button tiny Icon={FiPlus} onClick={addNew}>Add page</Button>, null, null]]} />
    </Page>;
};

const cmsRoutes = () => {
    const pages = store.getState().cms.pages || [];
    return pages.map(i => (
        <Route key={i.url} path={i.url} exact>
            <CMSPage page={i} />
        </Route>
    ));
};

export default () => {
    registerPlugin("adminPage", "cms", {
        component: CMSAdmin,
        sidebar: "Pages",
        Icon: FiFileText,
    });
    registerReducer("cms", cmsReducer);

    registerMount("app", "cms", CMSLoader);
    registerMount("routes", "cms", cmsRoutes, { isComponent: false });
};
