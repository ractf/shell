import React from "react";
import { Link } from "react-router-dom";

import broken from "../../static/broken.png"
import "./ErrorPages.scss";


export const BrokenShards = () => <img alt={""} className={"errorImg"} src={broken} />


export const ErrorPage = ({ code, details }) => <div className={"errorWrap"}>
    <div>{code || "Something went wrong"}</div>
    <div>{details}</div>
    <Link to={"/"}>Back to safety</Link>
</div>;

export const NotFound = () => <ErrorPage code={404} details={"Page not found"} />
