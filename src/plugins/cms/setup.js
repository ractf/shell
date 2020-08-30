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

import React, { useEffect, useContext, useState, useRef } from "react";

import { registerPlugin, registerReducer, appContext } from "ractf";
import { NotFound } from "pages/ErrorPages";
import http from "@ractf/http";
import { useReactRouter } from "@ractf/util";
import { useSelector, useDispatch } from "react-redux";
import { Markdown, Page, PageHead, Grid, Button, Row, Modal, Input, Form, HR, FormGroup, Link } from "@ractf/ui-kit";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import { Page as RoutesPage } from "controllers/Routes";
import { Redirect } from "react-router-dom";

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
        <Markdown source={page.content} />
    </Page>;
});
CMSPage.displayName = "CMSPage";

const CMSErrorPage = React.memo(() => {
    const { location } = useReactRouter();
    const pages = useSelector(state => state.cms.pages);
    for (const i of pages) {
        if (i.url === location.pathname) {
            return <CMSPage page={i} />;
        }
    }
    return <NotFound />;
});
CMSErrorPage.displayName = "CMSErrorPage";

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
    const app = useContext(appContext);
    const [editContent, setEditContent] = useState("");
    const [editingPage, setEditingPage] = useState(false);
    const formSubmit = useRef();

    const removePage = (page) => {
        app.promptConfirm(<>Are you sure you want to remove <code>{page.title}</code>?</>).then(() => {
            http.delete("/pages/" + page.id).then(() => {
                dispatch(setPages(pages.filter(i => i.id !== page.id)));
            }).catch(() => {
                app.alert("Failed to remove page");
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

    return <Page>
        {editingPage !== false ?
            <Modal header={"Editing Page"} onClose={() => setEditingPage(false)} onConfirm={() => formSubmit.current()}>
                <Form onChange={onEditChange} postSubmit={postSubmit}
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
                    <Markdown source={editContent} />
                </Form>
            </Modal> : null
        }
        <PageHead>Custom Site Pages</PageHead>
        <Grid headings={["Title", "URL", "Actions"]} data={[...pages.map(i => [
            i.title, <Link to={i.url}>{i.url}</Link>, <Row>
                <Button tiny warning Icon={FaPencilAlt} onClick={() => editPage(i)} />
                <Button tiny danger Icon={FaTrash} onClick={() => removePage(i)} />
            </Row>
        ]), [<Button tiny Icon={FaPlus} onClick={addNew}>Add page</Button>, null, null]]} />
    </Page>;
};

const HomeComponent = () => {
    const pages = useSelector(state => state.cms.pages);
    for (const i of pages) {
        if (i.url === "/") {
            return <CMSPage page={i} />;
        }
    }

    return <RoutesPage countdown={"registration_open"} auth>
        <Redirect to={"/campaign"} />
    </RoutesPage>;
};

export default () => {
    registerPlugin("errorPage", "404", {
        component: CMSErrorPage,
    });
    registerPlugin("page", "/", {
        component: HomeComponent
    });
    registerPlugin("mountWithinApp", "cms", {
        component: CMSLoader
    });
    registerPlugin("adminPage", "cms", {
        component: CMSAdmin,
        sidebar: "Pages",
    });
    registerReducer("cms", cmsReducer);
};
