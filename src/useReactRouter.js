import { useContext, useEffect, useState } from 'react';
import { __RouterContext } from 'react-router';


export default () => {
    const context = useContext(__RouterContext);

    const forceUpdate = useState(null)[1];
    useEffect(() => {
        context.history.listen(() => forceUpdate());
    }, [context, forceUpdate]);
    return context;
};
