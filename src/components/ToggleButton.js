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
                className={this.state.active === buttons.length ? "active" : ""}
                click={this.makeActive(buttons.length)}
                medium
            >{val[0]}</Button>)
        );

        return <div>
            <div className={"switchCaption"}>{this.props.children}</div>
            <div className={"switchButtonWrap"}>
                {buttons}
            </div>
        </div>;
    }
}
