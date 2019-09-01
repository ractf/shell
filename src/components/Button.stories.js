import React from "react";
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean, number } from '@storybook/addon-knobs';

import Button, { ButtonRow } from "./Button";

storiesOf("Button", module)
    .add("Default", () => <Button
        main={boolean('Main', false)}
        medium={boolean('Medium', false)}
        lesser={boolean('Lesser', false)}
        disabled={boolean('Disabled', false)}>Click Me</Button>)
    .add("With Action", () => <Button
        main={boolean('Main', false)}
        medium={boolean('Medium', false)}
        lesser={boolean('Lesser', false)}
        disabled={boolean('Disabled', false)}
        onClick={action("clicked")}>Click Me</Button>)
    .add("To URL", () => (
        <Button to={"/test"}
            main={boolean('Main', false)}
            medium={boolean('Medium', false)}
            lesser={boolean('Lesser', false)}
            disabled={boolean('Disabled', false)}>Click Me</Button>)
    );

storiesOf("ButtonRow", module)
    .add("Default", () => <ButtonRow>
        <Button>Click Me</Button>
        <Button>Click Me</Button>
    </ButtonRow>);
