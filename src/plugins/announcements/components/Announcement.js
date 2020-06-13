import React from "react";
import Moment from "react-moment";

import "./Announcement.scss";


const Announcement = ({ title, body, timestamp, hide}) => {
    return <div className={"notif"} onClick={hide}>
        <div className={"notifTitle"}>{title}</div>
        <div className={"notifBody"}>{body}</div>
        <div className={"notifTime"}>
            <Moment fromNow>{new Date(timestamp)}</Moment>
        </div>
    </div>;
};
export default Announcement;
