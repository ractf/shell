import React, { Component } from "react";
import styled, { css } from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const style = css`
    border-radius: 2px;
    color: #ddd;
    font-size: 21px;
    padding: 5px 10px;
    outline: none;
    min-width: ${props => props.width || "100%"};

    ${props => props.center ? css`text-align: center;` : null}
    ${props => props.valid ? css`
        background-color: #18162455;
        border: 1px solid #413d6399;
        &:focus {
            border: 1px solid #413d63;
            background-color: #181624;
        }
    ` : css`
        background-color: #ac323233;
        border: 1px solid #ac323299;
        &:focus {
            border: 1px solid #ac3232;
            background-color: #ac323255;
        }
    `}
    ${props => props.password && css`
        padding-left: calc(10px + 1em);
    `}

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

const StyledEye = styled.div`
    position: absolute;
    top: 50%;
    width: 1em;
    height: 1em;
    left: 10px;
    font-size: 1em;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    cursor: pointer;

    opacity: .4;

    &:hover {
        opacity: .6;
    }
`;


export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
            valid: true,
            showPass: false,
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let value = event.target.value;
        // Length limit
        if (this.props.limit)
            value = value.substring(0, this.props.limit);
        // Regex testing
        if (this.props.format)
            this.setState({ valid: this.props.format.test(value) });

        this.setState({ val: value });
        if (this.props.callback)
            this.props.callback(value, this.state.valid);
    }

    togglePwd = () => {
        this.setState({showPass: !this.state.showPass});
    }

    render() {
        return <InputWrap>
            {this.props.rows ?
                <StyledTextarea
                    value={this.state.val}
                    onChange={this.handleChange}
                    rows={this.props.rows}
                    placeholder={this.props.placeholder}
                    valid={this.state.val.length === 0 || this.state.valid}
                    {...this.props} />
                : <StyledInput
                    value={this.state.val}
                    type={(this.props.password && !this.state.showPass) ? "password" : "text"}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder}
                    valid={this.state.val.length === 0 || this.state.valid}
                    {...this.props} />}
            {this.props.center ? null
                : <LengthCounter>{this.state.val.length}{this.props.limit
                    ? "/" + this.props.limit
                    : ""
                }</LengthCounter>}
            {this.props.password ? <StyledEye onClick={this.togglePwd}>
                {this.state.showPass ? <FaEyeSlash /> : <FaEye />}
            </StyledEye> : null}
        </InputWrap>
    }
}
