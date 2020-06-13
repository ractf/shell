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
            <InputButton name={"ws"} val={process.env.REACT_APP_WSS_URL} placeholder={"wss://"}
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
