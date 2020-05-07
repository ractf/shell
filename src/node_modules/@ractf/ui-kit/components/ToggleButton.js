import React, { Component } from "react";

import { Button, FlexRow } from "@ractf/ui-kit";

import "./ToggleButton.scss";


export default class SwitchButton extends Component {
    constructor(props) {
        super(props);

        let initial = 0;
        if (typeof this.props.default !== "undefined") {
            this.props.options.forEach(([opt, val], n) => {
                if (val === this.props.default) {
                    initial = n;
                }
            });
        }
        this.state = {
            active: initial,
        };
    }

    makeActive(n) {
        return () => {
            this.setState({ active: n });

            if (this.props.onChange) {
                this.props.onChange(this.props.options[n][1]);
            }
        };
    }

    render() {
        let buttons = [];
        this.props.options.map((val) =>
            buttons.push(<Button
                key={val[1]}
                click={this.makeActive(buttons.length)} large
                lesser={this.state.active !== buttons.length}
            >{val[0]}</Button>)
        );

        return <FlexRow left className={"switchButtonWrap"}>
            {buttons}
        </FlexRow>;
    }
}
