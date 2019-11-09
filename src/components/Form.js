import React, { cloneElement, createRef } from "react";
import styled from "styled-components";


const FormWrap = styled.div`
    width: 100%;

    >div {
        margin-bottom: 16px;
    }
    >div:last-child {
        margin-bottom: 0;
    }
    >div:nth-last-child(2) {
        margin-bottom: 8px;
    }
`;


export default ({ children, submit, button, handle, locked }) => {
    //const components = [];
    const refs = [];

    const submitFunc = () => {
        let data = {};
        refs.forEach(ref => {
            if (ref.current) {
                data[ref.current.props.name] = ref.current.state.val;
            }
        });

        if (handle)
            handle(data);
    }
    
    if (submit) submit.callback = submitFunc;

    let key = 0;
    const recursor = (array) => {
        let changed = false;
        let newArray = array.slice().reverse();

        newArray.forEach((i, n) => {
            if (i instanceof Array) {
                let [nc, ch] = recursor(i);
                if (!ch) return;

                changed = true;
                newArray[n] = nc;
            }

            if (!(i && i.props)) return;

            if (i.props.submit && !button) {
                let ref = createRef();
                changed = true;

                newArray[n] = cloneElement(i, {
                    key: key++,
                    ref: ref,
                    disabled: i.props.disabled || locked,
                    click: submitFunc
                });
                button = ref;
            }

            if (i.props.name) {
                let ref = createRef();
                changed = true;
                newArray[n] = cloneElement(i, {
                    key: key++,
                    ref: ref,
                    disabled: i.props.disabled || locked,
                    next: refs.length > 0 ? refs[refs.length - 1] : button
                });
                refs.push(ref);
            }
            if (i.props.children instanceof Array) {
                let [nc, ch] = recursor(i.props.children);
                if (!ch)
                    return i;
                changed = true;
                newArray[n] = cloneElement(i, {
                    key: key++,
                    children: nc
                });
            }
        });
        newArray.reverse();
        return [newArray, changed];
    }
    let [components] = recursor(children);

    return <FormWrap>
        {components}
    </FormWrap>;
}

export const FormError = styled.div`
    color: #ac3232;
    font-weight: 500;
    font-size: 1.2em;
    white-space: pre-wrap;
    line-height: 1.5;
`;
