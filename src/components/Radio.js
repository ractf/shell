import React, { Component } from "react";

import "./Radio.scss";


export default class Radio extends Component {
    isInput = true;

    constructor(props) {
        super(props);

        this.state = {
            val: this.props.value || "",
        }
        this.ids = this.props.options.map(() => Math.random().toString().substring(2, 9999));
    }

    okd(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            e.target.click();
        }
    }

    change = e => {
        this.setState({ val: e.target.value });
        if (this.props.onChange) this.props.onChange(e.target.value);
    }

    render() {
        return <div className={"radioWrap"}>
            {this.props.options.map((i, n) => <div key={n}>
                <div onClick={e => this.setState({ val: i[1] })} onMouseDown={e=>e.target.click()}
                    onKeyDown={this.okd} tabIndex="0" className={"radioLabel" + (i[1] === this.state.val ? " checked" : "")}
                    htmlFor={this.ids[n]}>
                    <div className={"radioButton"} />
                    <div className={"radioLab"}>{i[0]}</div>
                </div>
            </div>)}
        </div>;
    }
}
