// Copyright (C) 2020 Really Awesome Technology Ltd
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

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import qs from "query-string";

import { Spinner, FormError } from "@ractf/ui-kit";
import { useReactRouter } from "@ractf/util";
import { verify } from "@ractf/api";
import { Wrap } from "./Parts";
import http from "@ractf/http";


export const EmailVerif = () => {
    const [verif, setVerif] = useState(0);
    const [message, setMessage] = useState("");

    const { location } = useReactRouter();
    const { id, secret } = qs.parse(location.search, { ignoreQueryPrefix: true });

    useEffect(() => {
        verify(id, secret).then(() => {
            setVerif(2);
        }).catch((e) => {
            setMessage(http.getError(e));
            setVerif(1);
        });
    }, [setVerif, setMessage, id, secret]);
    if (!(secret && id)) return <Redirect to={"/login"} />;

    return <Wrap>
        {verif === 0 ? <>
            <div>Verifying your account...</div>
            <Spinner />
        </> : verif === 1 ? <>
            <FormError>Account verification failed!</FormError>
            <br />
            <FormError>{message}</FormError>
        </> : verif === 2 ? <>
            <Redirect to={"/noteam"} />
        </> : null}
    </Wrap>;
};


export const EmailMessage = () => {
    return <Wrap>
        Thank you for registering!
        <br /><br />
        Please check your inbox for a verification link.
        <br /><br />
        Make sure to check your spam folder if you can't find it!
    </Wrap>;
};
