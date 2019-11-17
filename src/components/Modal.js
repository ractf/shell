import React from "react";

import Button, { ButtonRow } from "./Button";
import Form from "./Form";
import Input from "./Input";

import "./Modal.scss";


const Modal = ({ onHide, children, centre, small }) => {
    //const app = useContext(appContext);
    const doHide = hider => {
        return e => {
            //app.setModalOpen(false);
            if (hider)
                hider(e);
        }
    };

    return <div className={"modalWrap"}>
        <div className={"darken"} onMouseDown={(e => e.target.click())} onClick={doHide(onHide)} />
        <div className={"modalBoxWrap"}><div className={"modalBox" + (centre ? " centre" : "") + (small ? " small" : "")}>
            {children}
        </div></div>
    </div>;
}


export const ModalPrompt = ({ body, promise, onHide, inputs }) => {
    return <Modal onHide={() => {promise.reject(); onHide && onHide()}} small={body.small} centre>
        <p>
            { body.message }
            { inputs.length ? <br/> : null }
        </p>

        <Form handle={promise.resolve}>
            {inputs.map((i, n) => <Input key={n} width={'auto'} {...i} />)}

            <ButtonRow>
                <Button submit>{ body.okay || "Okay" }</Button>
                {!body.noCancel &&
                    <Button click={() => {promise.reject(); onHide && onHide()}}>{ body.cancel || "Cancel" }</Button>}
            </ButtonRow>
        </Form>
    </Modal>;
}


export default Modal;
