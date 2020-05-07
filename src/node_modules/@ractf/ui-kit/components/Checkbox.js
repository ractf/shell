import React, { Component } from "react";

import "./Checkbox.scss";

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            val: !!props.checked
        };
    }

    click = () => {
        this.setState({ val: !this.state.val });
    };

    render() {
        return <div className={"checkbox" + (this.state.val ? " checked" : "")} onClick={this.click}>
            <div className={"box"} />
            <div className={"cbLabel"}>{this.props.children}</div>
        </div>;
    }
}
