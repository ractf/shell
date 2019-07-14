import React, { Component } from "react";
import styled, { css } from "styled-components";


const style = css`
    border-radius: 2px;
    color: #ddd;
    font-size: 21px;
    padding: 5px 10px;
    outline: none;
    width: 100%;

    background-color: #18162455;
    border: 1px solid #413d6399;
    &:focus {
        border: 1px solid #413d63;
        background-color: #181624;
    }
    &:focus +div {
        opacity: .8;
    }
`;

const StyledInput = styled.input`
    ${style}
`;
const StyledTextarea = styled.textarea`
    ${style}
    resize: vertical;
`;
const InputWrap = styled.div`
    position: relative;
`;
const LengthCounter = styled.div`
    position: absolute;
    right: 8px;
    top: 4px;
    font-size: .8em;
    opacity: .4;
`;


export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: props.val || ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        if (this.props.limit)
            this.setState({val: event.target.value.substring(0, this.props.limit)});
        else
            this.setState({val: event.target.value});
    }

    render() {
        return <InputWrap>
            {this.props.rows ?
                <StyledTextarea
                    value={this.state.val}
                    onChange={this.handleChange}
                    rows={this.props.rows}
                    placeholder={this.props.placeholder} />
                : <StyledInput
                    value={this.state.val}
                    type={this.props.password ? "password" : "text"}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder} />}
            <LengthCounter>{this.state.val.length}{this.props.limit
                ? "/" + this.props.limit
                : ""
            }</LengthCounter>
        </InputWrap>
    }
}
