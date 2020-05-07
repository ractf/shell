import React, { Component } from "react";

import { Input, Button } from "@ractf/ui-kit";

import "./InputButton.scss";

export default class InputButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
        };
        this.button = React.createRef();
    }

    onChange = (val) => {
        this.setState({ val: val });
    };

    onSubmit = () => {
        if (this.props.click)
            this.props.click();
    }

    render() {
        return <div className={"inlineButton" + (this.props.className ? " " + this.props.className : "")}>
            <Input {...this.props} onSubmit={this.onSubmit} onChange={this.onChange} val={this.state.val} />
            <Button large ref={this.button} click={this.onSubmit} disabled={this.props.disabled}>
                {this.props.button || "Submit"}
            </Button>
        </div>;
    }
}
