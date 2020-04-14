import React, { Component } from "react";
import Button from "./Button";

import "./ToggleButton.scss";


export default class SwitchButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.default || 0
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

        return <div className={"switchButtonWrap"}>
            {buttons}
        </div>;
    }
}
