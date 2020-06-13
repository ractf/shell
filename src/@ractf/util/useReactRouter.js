import { useContext, useEffect, useState } from "react";
import { __RouterContext } from "react-router";


export default () => {
    const context = useContext(__RouterContext);

    const forceUpdate = useState(null)[1];
    useEffect(() => {
        let isMounted = true;
        context.history.listen(() => {
            if (isMounted) forceUpdate();
        });
        return () => { isMounted = false; };
    }, [context, forceUpdate]);
    return context;
};
