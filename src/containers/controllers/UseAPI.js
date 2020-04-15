import { useContext, useState, useEffect, useRef } from "react";

import { APIEndpoints } from "./Contexts";


export const useApi = route => {
    const api = useContext(APIEndpoints);
    const [data, setData] = useState(api.getCache(route));
    const [error, setError] = useState(null);
    const abortRequest = useRef();

    useEffect(() => {
        const [makeRequest, ar] = api.abortableGet(route);
        abortRequest.current = ar;

        makeRequest().then(data => {
            setData(data);
        }).catch(e => setError(api.getError(e)));
    }, [route, api]);
    useEffect(() => {
        return () => {
            if (abortRequest.current) abortRequest.current();
        };
    }, []);

    return [data, error];
};


export const usePaginated = route => {
    const api = useContext(APIEndpoints);
    const abortRequest = useRef();
    const page = useRef();
    page.current = page.current || 1;
    const [state, setState] = useState({
        loading: true,
        data: [],
        hasMore: true,
        total: 0,
        error: null
    });

    const next = () => {
        const path = (page.current === 0) ? route : (route + "?page=" + page.current);

        const [makeRequest, ar] = api.abortableGet(path);
        abortRequest.current = ar;

        makeRequest().then(data => {
            if (!data) return;
            setState(prevState => ({
                ...prevState, loading: false,
                data: [...prevState.data, ...data.results],
                total: data.total,
                hasMore: !!data.next
            }));
        }).catch(e => {
            setState(prevState => ({
                ...prevState,
                loading: false,
                error: api.getError(e)
            }));
        });
    };
    
    useEffect(() => {
        next();
        return () => {
            if (abortRequest.current) abortRequest.current();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [state, next];
};


export const useFullyPaginated = route => {
    const api = useContext(APIEndpoints);
    const abortRequest = useRef();

    const page = useRef();
    page.current = page.current || 1;
    const [state, setState] = useState({
        data: [],
        error: null
    });

    const more = () => {
        let path = (page.current === 0) ? route : (route + "?page=" + page.current);

        const [makeRequest, ar] = api.abortableGet(path);
        abortRequest.current = ar;

        makeRequest().then(data => {
            if (!data) return;
            setState(prevState => ({
                ...prevState, data: [...prevState.data, ...data.results]
            }));
            page.current++;
            if (data.next) more();
        }).catch(e => {
            setState(prevState => ({
                ...prevState, error: api.getError(e)
            }));
        });
    };

    useEffect(() => {
        more();
        return () => {
            if (abortRequest.current) abortRequest.current();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return state;
};
