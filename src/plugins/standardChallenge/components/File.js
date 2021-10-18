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

import React, { useContext } from "react";
import { FiFile, FiEdit2, FiTrash } from "react-icons/fi";

import { NUMBER_RE, formatBytes } from "@ractf/util";
import { removeFile, editFile } from "@ractf/api";
import { Button, Container, UiKitModals } from "@ractf/ui-kit";
import * as http from "@ractf/util/http";

import "./Challenge.scss";


export default ({ name, url, size, id, isEdit, md5, ...props }) => {
    const modals = useContext(UiKitModals);

    const edit = () => {
        modals.promptConfirm({ message: "Edit file", remove: () => removeFile(id) },
            [{ name: "name", placeholder: "File name", label: "Name", val: name },
            { name: "url", placeholder: "File URL", label: "URL", val: url },
            { name: "md5", placeholder: "MD5 Hash", label: "MD5", val: md5 },
            { name: "size", placeholder: "File size", label: "Size (bytes)", val: size.toString(), format: NUMBER_RE }]
        ).then(({ name, url, size }) => {

            if (!size.toString().match(NUMBER_RE)) return modals.alert("Invalid file size!");

            editFile(id, name, url, size).then(() =>
                modals.alert("File edited!")
            ).catch(e =>
                modals.alert("Error editing file:\n" + http.getError(e))
            );
        }).catch(() => { });
    };

    if (isEdit) {
        return <Container toolbar>
            <Button tiny warning Icon={FiEdit2} onClick={edit} />
            <Button tiny danger Icon={FiTrash} onClick={() => removeFile(id)} />
        </Container>;
    }

    return <a href={url} target={"_blank"} rel={"noopener noreferrer"}>
        <Button Icon={FiFile} tooltip={formatBytes(size)} {...props}>
            {`${name} - ${md5.slice(0, 6)}`}
        </Button>
    </a>;
};
