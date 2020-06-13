import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { hideNotification } from "../actions";
import { Markdown } from "@ractf/ui-kit";


const PopupMessage = ({ data }) => {
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(hideNotification(data));
    };

    return <div onClick={onClick}>
        <div>{data.title}</div>
        <div><Markdown>{data.body}</Markdown></div>
    </div>;
};

const AppNotifications = () => {
    const notifications = useSelector(store => store.notifications) || [];

    return <div className={"popupMessages"}>
        {notifications.map(i => <PopupMessage data={i} key={i.id} />)}
    </div>;
};
export default AppNotifications;
