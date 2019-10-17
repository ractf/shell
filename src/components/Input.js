import React, { Component, createRef } from "react";
import styled, { css } from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const style = css`
    background: none;
    border: 0;
    width: 100%;
    color: inherit;

    &:focus {
        border: none;
        outline: none;
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

    padding: 5px 10px;

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
        &:focus-within {
            border: 1px solid #413d63;
            background-color: #181624;
        }
    ` : css`
        background-color: #ac323233;
        border: 1px solid #ac323299;
        &:focus-within {
            border: 1px solid #ac3232;
            background-color: #ac323255;
        }
    `}
    ${props => props.password && css`
        padding-left: 38px;
    `}
    ${props => props.disabled && css`
        background-color: #18162411;
    `}

    &:focus-within > div:nth-of-type(1) {
        opacity: .8;
    }
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
    width: 20px;
    height: 20px;
    left: 10px;
    font-size: 20px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    cursor: pointer;

    opacity: .4;

    &:hover {
        opacity: .6;
    }
`;

const Placeholder = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: inherit;
    text-align: left;
    font-size: 21px;
    color: #777;

    user-select: none;
    pointer-events: none;
`;


export default class Input extends Component {
    isInput = true;

    constructor(props) {
        super(props);

        this.state = {
            val: props.val || "",
            valid: true,
            showPass: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.inputRef = createRef();

        this.isInput = true;
    }

    handleChange(event) {
        let value = event.target.value;
        // Length limit
        if (this.props.limit)
            value = value.substring(0, this.props.limit);
        // Regex testing
        let valid;
        if (this.props.format) {
            valid = this.props.format.test(value);
            this.setState({ valid: valid });
        } else valid = true;

        this.setState({ val: value });
        if (this.props.callback)
            this.props.callback(value, valid);
    }

    togglePwd = () => {
        this.setState({ showPass: !this.state.showPass });
    }

    keyDown = (e) => {
        if (e.keyCode === 13 && this.props.next) {
            e.preventDefault();
            this.props.next.current.click();
        }
    }

    click = () => {
        this.inputRef.current.focus();
    }

    render() {
        return <InputWrap valid={this.state.val.length === 0 || this.state.valid} {...this.props}>
            {this.props.rows ?
                <StyledTextarea
                    ref={this.inputRef}
                    value={this.state.val}
                    onChange={this.handleChange}
                    rows={this.props.rows}
                    disabled={this.props.disabled} />
                : <StyledInput
                    onKeyDown={this.keyDown}
                    ref={this.inputRef}
                    value={this.state.val}
                    type={(this.props.password && !this.state.showPass) ? "password" : "text"}
                    onChange={this.handleChange}
                    disabled={this.props.disabled} />}
            {this.props.center || this.props.noCount ? null
                : <LengthCounter>{this.state.val.length}{this.props.limit
                    ? "/" + this.props.limit
                    : ""
                }</LengthCounter>}
            {this.props.password ? <StyledEye onClick={this.togglePwd}>
                {this.state.showPass ? <FaEyeSlash /> : <FaEye />}
            </StyledEye> : null}
            {this.props.placeholder && this.state.val.length === 0 && <Placeholder>{this.props.placeholder}</Placeholder>}
        </InputWrap>
    }
}
