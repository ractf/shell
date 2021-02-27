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

import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { add_2fa, verify_2fa, reloadAll } from "@ractf/api";
import {
    Form, Page, Button, Spinner, TextBlock, UiKitModals, InputPin, Container
} from "@ractf/ui-kit";

import Link from "components/Link";
import QRCode from "qrcode.react";


export default () => {
    const modals = useContext(UiKitModals);
    const user = useSelector(state => state.user);
    const [page, setPage] = useState(0);
    const [secret, setSecret] = useState("");
    const [message, setMessage] = useState(null);

    const { t } = useTranslation();

    const startFlow = () => {
        setPage(1);

        add_2fa().then(resp => {
            setSecret(resp.totp_secret);
            setPage(2);
        }).catch(() => {
            setPage(-1);
        });
    };

    const faPrompt = () => {
        modals.promptConfirm({ message: t("2fa.required"), small: true },
            [{
                Component: function Modal2FA({ ...props }) {
                    return <Container centre><InputPin digits={6} {...props} /></Container>;
                }, name: "pin"
            }]
        ).then(({ pin }) => {
            if (pin.length !== 6) return faPrompt();

            verify_2fa(pin).then(async resp => {
                if (resp.valid) {
                    await reloadAll();
                    setPage(3);
                } else { setMessage(t("2fa.validation_fail")); }
            }).catch(e => {
                console.error(e);
                setMessage(t("2fa.validation_fail"));
            });
        }).catch(() => {
            setMessage(t("2fa.unable_to_active"));
        });
    };

    const buildURI = sec => {
        return `otpauth://totp/RACTF:${user.username}?secret=${sec}&issuer=RACTF`;
    };

    const formatSecret = sec => {
        return (
            sec.substring(0, 4) + " " + sec.substring(4, 8) + " " +
            sec.substring(8, 12) + " " + sec.substring(12, 16)
        );
    };

    return <Page title={t("2fa.2fa")} centre>
        {page === 0 ? <>
            <p>
                {user.has_2fa ? t("2fa.replace_prompt") : t("2fa.add_prompt")}<br />
                {t("2fa.device_warning")}
            </p>
            <Container centre toolbar>
                <Link to={"/settings"}>
                    <Button lesser>{t("2fa.nevermind")}</Button>
                </Link>
                <Button onClick={startFlow}>{t("2fa.enable_2fa")}</Button>
            </Container>
        </> : page === 1 ? <>
            <p>
                {t("2fa.enabling")}
            </p>
            <Container centre>
                <Spinner />
            </Container>
        </> : page === 2 ? <>
            <h2>{t("2fa.finalise")}</h2>
            <p>{t("2fa.please_scan_qr")}</p>
            <QRCode renderAs={"svg"} size={200} fgColor={"#161422"}
                value={buildURI(secret)} includeMargin />
            <p>{t("2fa.unable_to_qr")}</p>
            <TextBlock>
                {formatSecret(secret)}
            </TextBlock>
            {message && <Form.Error>{message}</Form.Error>}

            <Container toolbar centre>
                <Link to={"/settings"}>
                    <Button lesser>{t("cancel")}</Button>
                </Link>
                <Button onClick={faPrompt}>{t("2fa.got_it")}</Button>
            </Container>
        </> : page === 3 ? <>
            <h2>{t("2fa.congratulations")}</h2>
            <p>{t("2fa.setup")}</p>
            <Container toolbar centre>
                <Link to={"/"}>
                    <Button>Yay!</Button>
                </Link>
            </Container>
        </> : page === -1 ? <>
            <p>{t("2fa.error")}</p>
            <Container toolbar centre>
                <Link to={"/settings"}>
                    <Button lesser>{t("2fa.back_to_settings")}</Button>
                </Link>
                <Button onClick={() => setPage(0)}>{t("2fa.restart")}</Button>
            </Container>
        </> : null}
    </Page>;
};
