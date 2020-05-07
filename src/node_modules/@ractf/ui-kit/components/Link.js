import React, { useCallback } from "react";

import { useReactRouter } from "@ractf/util";


export const Link = React.memo(({ to, children, onClick, ...props }) => {
    const { history } = useReactRouter();

    const click = useCallback((e) => {
        if (onClick) onClick(e);
        history.push(to);
        e.preventDefault();
        return false;
    }, [onClick, to, history]);

    return <a href={to} onClick={click} {...props}>
        {children}
    </a>;
});
