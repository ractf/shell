import React, { cloneElement, createRef } from "react";

import Input from "./Input";


export const formAction = () => {
    return {};
}


export default ({ children, submit, button, handle }) => {
    const components = [];
    const refs = [];

    let submitFunc = () => {
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

    for (let i = children.length - 1; i >= 0; i--) {
        if (!children[i]) {
            components[i] = undefined;
            continue;
        }
        if (children[i].type.prototype instanceof Input) {
            let ref = createRef();
            components[i] = cloneElement(children[i], {
                key: i,
                ref: ref,
                next: refs.length > 0 ? refs[refs.length - 1] : button
            });
            refs.push(ref);
        } else {
            components[i] = cloneElement(children[i], {
                key: i
            });
        }
    }

    return <>
        {components}
    </>;
}