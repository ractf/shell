import React, { cloneElement, createRef } from "react";

import "./Form.scss";


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
    };

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
                if (i.props.name) refs.push(ref);
            } else if (i.props.name) {
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
            if (i.props.children) {
                let [nc, ch] = recursor(React.Children.toArray(i.props.children));
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
    };
    let [components] = recursor(React.Children.toArray(children));

    return <div className={"formWrapper"}>
        {components}
    </div>;
};

export const FormError = ({ children }) => (
    <div className={"formError"}>{children}</div>
);
