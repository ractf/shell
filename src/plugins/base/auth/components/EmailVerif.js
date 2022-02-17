// Copyright (C) 2020-2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button, Form, Spinner, Markdown } from "@ractf/ui-kit";
import { useReactRouter } from "@ractf/util";
import { verify } from "@ractf/api";
import * as http from "@ractf/util/http";

import Link from "components/Link";
import qs from "query-string";

import { Wrap } from "./Parts";


export const EmailVerif = () => {
    const user = useSelector(state => state.user);
    const pages = useSelector(state => state.cms.pages);
    const page = pages.find(i => i.url === "/conduct");
    const { t } = useTranslation();

    const [verif, setVerif] = useState(-1); // -1 = not started, 0 = loading, 1 = error, 2 = success
    const [message, setMessage] = useState("");

    const { location } = useReactRouter();
    const { id, secret } = qs.parse(location.search, { ignoreQueryPrefix: true });

    const runVerif = () => {
        setVerif(0);
        verify(id, secret).then(() => {
            setVerif(2);
        }).catch((e) => {
            setMessage(http.getError(e));
            setVerif(1);
        });
    };

    if (!(secret && id)) return <Redirect to={"/login"} />;
    if (user?.is_verified) return <Redirect to={"/"} />;

    return <Wrap>
        <div>
            <div style={{textAlign: "center"}}>
               {t("auth.welcome")}
            </div>
            {page && <Markdown LinkElem={Link} source={page.content} />}
        </div>
        <div style={{ textAlign: "center" }}>
            {verif === -1 ? <>
                <Button onClick={runVerif} disabled={verif === 0}>Verify Email</Button>
                {verif === 0 && <Spinner /> }
                <br />
            </> : verif === 1 ? <>
                <Form.Error>Account verification failed!</Form.Error>
                <br />
                <Form.Error>{message}</Form.Error>
            </> : verif === 2 ? <>
                <Redirect to={"/welcome"} />
            </> : null}
        </div>
    </Wrap>;
};

export const EmailMessage = () => {
    return <Wrap>
        <div style={{ textAlign: "center" }}>
            Thank you for registering!
            <br /><br />
            Please check your inbox for a verification link.
            <br /><br />
            Make sure to check your spam folder if you can't find it!
        </div>
    </Wrap>;
};
