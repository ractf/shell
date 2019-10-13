import React, { createRef } from "react";
import styled from "styled-components";

import Button, { ButtonRow } from "./Button";
import Form, { formAction } from "./Form";
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
`;


const Modal = ({ onHide, children, centre, small }) =>
    <ModalWrap>
        <Darken onMouseDown={(e => e.target.click())} onClick={onHide || (() => null)} />
        <ModalBox centre={centre} small={small}>
            {children}
        </ModalBox>
    </ModalWrap>;


export const ModalPrompt = ({ body, promise, onHide, inputs }) => {
    const submit = formAction();
    const button = createRef();

    return <Modal onHide={onHide} small={body.small} centre>
        <ModalP>
            { body.message }
            { inputs.length ? <br/> : null }
        </ModalP>

        <Form submit={submit} handle={promise.resolve} button={button}>
            {inputs.map((i, n) => <Input key={n} width={'auto'} {...i} />)}

            <ButtonRow>
                <Button ref={button} form={submit}>{ body.okay || "Okay" }</Button>
                <Button onClick={promise.reject}>{ body.cancel || "Cancel" }</Button>
            </ButtonRow>
        </Form>
    </Modal>;
}


export default Modal;
