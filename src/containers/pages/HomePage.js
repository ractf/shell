import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';

import Page from "./bases/Page";

import { apiContext, Link } from "ractf";

import "./HomePage.scss";


export default () => {
    const api = useContext(apiContext);
    const { t } = useTranslation();

    return <Page noPad selfContained>
        <div className="fancySite">
            <div className="primary">
                <div className="inner">
                    <div className="top">
                        <div className="sub">We're back for 2020...</div>
                        <div className="cta">Really Awesome CTF</div>
                        <div className="sub sub2">...and it's going to be massive!</div>
                        {api.user ? <>
                            <Link to="/campaign" className="cts">{t("home.cta")}</Link>
                        </> : <>
                                <Link to="/login" className="cts">{t("home.login")}</Link>
                                <Link to="/register" className="cts">{t("home.signup")}</Link>
                            </>}
                    </div>
                </div>
            </div>

            <div className="secondary">
                <div className="inner">
                    <h1>What <i>is</i> RACTF?</h1>
                    <p>{t("home.para_1")}</p>
                    <p>{t("home.para_2")}</p>
                    <h1>Hold on. What's a capture-the-flag?</h1>
                    <p>{t("home.para_3")}</p>
                    <h1>What can I expect?</h1>
                    <p style={{ marginBottom: 8 }}>{t("home.para_4")}</p>
                    <p>{t("home.para_5")}</p>
                    <p>{t("home.para_6")}</p>
                    <ul>
                        <li>{t("home.osint")}</li>
                        <li>{t("home.crypto")}</li>
                        <li>{t("home.web")}</li>
                        <li>{t("home.binexp")}</li>
                        <li>{t("home.linux")}</li>
                        <li>{t("home.more")}</li>
                    </ul>
                    <h1>Who's behind this?</h1>
                    <p>{t("home.para_7")}</p>
                </div>
            </div>
        </div>
    </Page>;
};
