import React from "react";
import Moment from 'react-moment';

import "./Announcement.scss";


export default ({ title, body, time, hide}) => {
    return <div className={"notif"} onClick={hide}>
        <div className={"notifTitle"}>{title}</div>
        <div className={"notifBody"}>{body}</div>
        <div className={"notifTime"}>
            <Moment fromNow>{time}</Moment>
        </div>
    </div>;
};
