import React from "react";
import { Link } from "react-router-dom";

import broken from "../../static/broken.png" 
import "./ErrorPages.scss";


export const BrokenShards = () => <img alt={""} className={"errorImg"} src={broken} />


export const ErrorPage = (props) => <div className={"errorWrap"}>
    <div>{props.code || "Something went wrong"}</div>
    <div>{props.details}</div>
    <Link to={"/"}>Back to safety</Link>
</div>;

export const NotFound = () => <ErrorPage code={404} details={"Page not found"} />
