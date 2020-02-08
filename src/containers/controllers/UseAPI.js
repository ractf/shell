import { useContext, useState, useEffect } from "react";

import { APIEndpoints } from "./Contexts";


export default (route) => {
    const api = useContext(APIEndpoints);
    const [data, setData] = useState(api.getCache(route));
    const [error, setError] = useState(null);

    useEffect(() => {
        api.cachedGet(route).then(data => {
            setData(data);
        }).catch(e => setError(api.getError(e)));
    }, [route, api]);

    return [data, error];
};
