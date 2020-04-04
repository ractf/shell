import React from "react";
import { useTranslation } from 'react-i18next';

import { Link } from "ractf";

import broken from "../../static/broken.png";
import "./ErrorPages.scss";


export const BrokenShards = () => <img alt={""} className={"errorImg"} src={broken} />;


export const ErrorPage = ({ code, details }) => {
    const { t } = useTranslation();

    return <div className={"errorWrap"}>
        <div>{code || t("errors.generic")}</div>
        <div>{details}</div>
        <Link to={"/"}>{t("errors.return")}</Link>
    </div>;
};

export const NotFound = () => {
    const { t } = useTranslation();

    return <ErrorPage code={404} details={t("errors.404")} />;
};
