import React from "react";
import { storiesOf } from '@storybook/react';

import Input from "./Input";

storiesOf("Input", module)
    .add("Default", () => <Input />)
    .add("Placeholder", () => <Input placeholder={"Placeholder"} />)
    .add("Multiline", () => <Input rows={5} />)
    .add("Multiline Placeholder", () => <Input placeholder={"Placeholder"} rows={5} />)
    .add("Limited", () => <Input limit={5} />)
    .add("Multiline Limited", () => <Input rows={5} limit={5} />)
    .add("Password", () => <Input password />)
    .add("Centre", () => <Input center />);
