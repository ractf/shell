import React from "react";

import { useReactRouter } from "ractf";


export const Link = React.memo(({ to, children, onClick, ...props }) => {
    const { history } = useReactRouter();

    const click = (e) => {
        if (onClick) onClick(e);
        history.push(to);
        e.preventDefault();
        return false;
    };

    return <a href={to} onClick={click} {...props}>
        {children}
    </a>;
});
