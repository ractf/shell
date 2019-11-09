import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { FaLink } from "react-icons/fa";
import { apiContext } from "ractf";

import "./Page.scss";


const LinkIcon = ({ url }) => {
    if (!url) return null;
    return <a href={url}>
        <FaLink className={"headLinkIcon"} />
    </a>;
};


const LinkDropdown = ({ name, children }) => {
    return <div className={"headLink"} style={{ position: "relative" }}>{name}
        <ul className={"headDropdownBody"}>
            {children}
        </ul>
    </div>
};


export default ({ title, url, children, vCentre, selfContained }) => {
    const api = useContext(apiContext);

    return (
        <>
            <div className={"pageHead" + ((!title || title.length === 0) ? " minimal" : "")}>
                {title ? <div className={"headTitle"}>
                    {title}
                    {url ? <LinkIcon url={url} /> : null}
                </div> : null}
                <div className={"headLinks"}>
                    <Link className={"headLink"} to={"/users"}>Users</Link>
                    <Link className={"headLink"} to={"/teams"}>Teams</Link>
                    <Link className={"headLink"} to={"/leaderboard"}>Leaderboard</Link>

                    {api.authenticated
                        ? <>
                            <Link className={"headLink"} to={"/campaign"}>Challenges</Link>
                            <Link className={"headLink"} to={api.team ? "/team" : "/team/join"}>My Team</Link>
                            <LinkDropdown name={api.user.username}>
                                <Link className={"headLink"} to={"/profile"}>Profile</Link>
                                <Link className={"headLink"} to={"/settings"}>Settings</Link>
                            </LinkDropdown>
                            <Link className={"headLink"} to={"/logout"}>Logout</Link>
                        </>
                        : <Link className={"headLink"} to={"/login"}>Login</Link>}
                </div>
            </div>
            {selfContained ? children :
                <div className={"pageContent" + (vCentre ? " vCentre" : "")}>
                    {children}
                </div>
            }
        </>
    );
};
