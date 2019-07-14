import React, { Component } from "react";
import styled from "styled-components";
import Button from "./Button";


const SwitchButtonWrap = styled.div`
    font-size: 0;

    >button {
        border-radius: 0;
        display: inline-block;
        margin: 0;
        min-width: 100px;
        opacity: .5;
        transition: none;
    }

    >button:first-child {
        border-radius: 2px 0 0 2px;
    }

    >button:last-child {
        border-radius: 0 2px 2px 0;
    }

    >button.active {
        opacity: 1;
    }
`;

const SwitchCaption = styled.div`
    font-size: 1.2em;
    margin-bottom: 8px;
`;


export default class SwitchButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.default || 0
        }
    }

    makeActive(n) {
        return () => {
            this.setState({ active: n });

            if (this.props.onChange) {
                this.props.onChange(this.props.options[n][1])
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
            <SwitchCaption>{this.props.children}</SwitchCaption>
            <SwitchButtonWrap>
                {buttons}
            </SwitchButtonWrap>
        </div>;
    }
}
