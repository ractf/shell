import React from "react";
import styled from "styled-components";

import Button, { ButtonRow } from "./Button";
import Form from "./Form";
import Input from "./Input";

import theme from "theme";


const Darken = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .2);
    z-index: -1;
`;


const ModalWrap = styled.div`
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const ModalBox = styled.div`
    border: 1px solid ${theme.bg_l1};
    padding: 32px 48px;
    background-color: ${theme.bg};
    box-shadow: 0 0 25px -10px #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 75vw;
    width: ${props => props.small ? "auto" :" 930px"};
    text-align: ${props => props.centre ? "center" : "inherit"};
`;

const ModalP = styled.p`
    margin-top: 0;
    white-space: pre-wrap;
`;


const Modal = ({ onHide, children, centre, small }) =>
    <ModalWrap>
        <Darken onMouseDown={(e => e.target.click())} onClick={onHide || (() => null)} />
        <ModalBox centre={centre} small={small}>
            {children}
        </ModalBox>
    </ModalWrap>;


export const ModalPrompt = ({ body, promise, onHide, inputs }) => {
    return <Modal onHide={() => {promise.reject(); onHide && onHide()}} small={body.small} centre>
        <ModalP>
            { body.message }
            { inputs.length ? <br/> : null }
        </ModalP>

        <Form handle={promise.resolve}>
            {inputs.map((i, n) => <Input key={n} width={'auto'} {...i} />)}

            <ButtonRow>
                <Button submit>{ body.okay || "Okay" }</Button>
                <Button onClick={promise.reject}>{ body.cancel || "Cancel" }</Button>
            </ButtonRow>
        </Form>
    </Modal>;
}


export default Modal;
