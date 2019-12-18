import React, { useContext } from "react";
import { FaInfoCircle } from "react-icons/fa";

import "./Challenge.scss";
import { apiContext, appContext } from "ractf";


export default ({ name, points, hintUsed, isEdit, onClick, id, body }) => {
    const app = useContext(appContext);
    const api = useContext(apiContext);

    const edit = () => {
        app.promptConfirm({message: "Edit hint"},
            [{name: 'name', placeholder: 'Hint name', val: name, label: "Name"},
             {name: 'cost', placeholder: 'Hint cost', val: points, label: "Cost", format: /\d+/},
             {name: 'body', placeholder: 'Hint text', val: body, label: "Message", rows: 5}]
        ).then(({ name, cost, body }) => {

            if (!cost.toString().match(/\d+/)) return app.alert("Invalid hint const!");

            api.editHint(id, name, cost, body).then(() =>
                app.alert("Hint edited!")
            ).catch(e =>
                app.alert("Error editing hint:\n" + api.getError(e))
            );
        });
    };

    return <div className={"challengeLink clickable" + (hintUsed ? " hintUsed" : "")}
                onClick={isEdit ? (() => edit()) : onClick}>
        <FaInfoCircle />
        <div>
            {name}
            <div className={"challengeLinkMeta"}>-{points} points.</div>
        </div>
    </div>;
};
