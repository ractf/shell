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

import React, { useState, useRef } from "react";

import { Form, Table, Page, InputButton, FlashText, HR } from "@ractf/ui-kit";


export default () => {
    const sock = useRef();
    const [state, setState] = useState(null);
    const [msgs, setMsgs] = useState([]);

    const connect = ({ ws }) => {
        sock.current = new WebSocket(ws);

        sock.current.onopen = () => {
            setState("Connected to " + ws);
        };
        sock.current.onclose = () => {
            setState(null);
        };
        sock.current.onerror = (e) => {
            setMsgs(msgs => [...msgs, ["error", e.toString()]]);
        };
        sock.current.onmessage = (msg) => {
            setMsgs(msgs => [...msgs, ["down", msg.data]]);
        };
    };
    const send = ({ data }) => {
        sock.current.send(data);
        setMsgs(msgs => [...msgs, ["up", data]]);
    };

    return <Page>
        <FlashText danger={!state}>{state ? state : "WebSocket closed"}</FlashText>
        <Form handle={connect}>
            <InputButton name={"ws"} val={window.env.wssUrl} placeholder={"wss://"}
                button={"Connect"} submit />
        </Form>
        <HR />
        <Form handle={send} disabled={state}>
            <InputButton name={"data"} placeholder={"JSON"}
                button={"Send"} submit />
        </Form>
        <HR />
        <Table headings={["type", "data"]} data={
            msgs.map(([type, data]) => [<code>{type}</code>, <code>{data}</code>])
        } />
    </Page>;
};
