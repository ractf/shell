import React, { cloneElement, createRef } from "react";


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

    children.slice().reverse().forEach(i => {
        let list = (i instanceof Array) ? i : [i];
        
        list.slice().reverse().forEach(j => {
            if (!j) {
                components.push(null);
            } else if (j.props.name) {
                let ref = createRef();

                components.push(cloneElement(j, {
                    key: components.length,
                    ref: ref,
                    next: refs.length > 0 ? refs[refs.length - 1] : button
                }));
                refs.push(ref);
            } else {
                components.push(cloneElement(j, {
                    key: components.length
                }));
            }
        });
    });

    return <>
        {components.reverse()}
    </>;
}