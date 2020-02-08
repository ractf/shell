import React from "react";

import { Spinner } from "ractf";

import "./Parts.scss";


export const EMAIL_RE = /^\S+@\S+\.\S+$/;


export const Wrap = ({ locked = false, children }) => {
    return <div className={"authWrap"}>
        {children}
        {locked && <div className={"authDarken"}><Spinner /></div>}
    </div>;
};
