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
import { useTranslation } from "react-i18next";
import { FiHelpCircle, FiEdit2, FiTrash } from "react-icons/fi";

import { removeHint, editHint, useHint } from "@ractf/api";
import { Button, Row, Markdown, UiKitModals } from "@ractf/ui-kit";
import { NUMBER_RE } from "@ractf/util";
import * as http from "@ractf/util/http";

import Link from "components/Link";
import "./Challenge.scss";


export default ({ name, text, penalty, used, isEdit, onClick, id, ...props }) => {
    const modals = useContext(UiKitModals);
    const { t } = useTranslation();

    const edit = () => {
        modals.promptConfirm({ message: "Edit hint", remove: () => removeHint(id) },
            [{ name: "name", placeholder: "Hint name", val: name, label: "Name" },
            { name: "cost", placeholder: "Hint cost", val: penalty.toString(), label: "Cost", format: NUMBER_RE },
            { name: "text", placeholder: "Hint text", val: text, label: "Message", rows: 5 }]
        ).then(({ name, cost, text }) => {

            if (!cost.toString().match(NUMBER_RE)) return modals.alert("Invalid hint const!");

            editHint(id, name, cost, text).then(() =>
                modals.alert("Hint edited!")
            ).catch(e =>
                modals.alert("Error editing hint:\n" + http.getError(e))
            );
        }).catch(() => { });
    };

    const showHint = (content) => {
        modals.alert(<>
            <b>{name}</b><br />
            <Markdown LinkElem={Link} source={content} />
        </>);
    };

    const promptHint = () => {
        if (used) return showHint(text);

        const msg = <>
            Are you sure you want to use a hint?<br /><br />
                This hint will deduct {penalty} points from this challenge.
        </>;
        modals.promptConfirm({ message: msg, small: true }).then(() => {
            useHint(id).then(hint => {
                showHint(hint.text);
            }).catch(e =>
                modals.alert("Error using hint:\n" + http.getError(e))
            );
        }).catch(() => { });
    };

    if (isEdit) {
        return <Row>
            <Button tiny warning Icon={FiEdit2} onClick={edit} />
            <Button tiny danger Icon={FiTrash} onClick={() => removeHint(id)} />
        </Row>;
    }

    return <Button onClick={promptHint} Icon={FiHelpCircle} {...props}
        tooltip={penalty === 0 ? "Free" : "-" + t("point_count", { count: penalty })} success={used}>
        {name}
    </Button>;
};
