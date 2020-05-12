import { useContext, useState, useEffect, useRef } from "react";

import { APIEndpoints } from "./Contexts";


export const useApi = route => {
    const api = useContext(APIEndpoints);
    const [data, setData] = useState(api.getCache(route));
    const [error, setError] = useState(null);
    const abortRequest = useRef();

    useEffect(() => {
        const [request, ar] = api.abortableGet(route);
        abortRequest.current = ar;
        request.then(data => {
            setData(data);
        }).catch(e => setError(api.getError(e)));
    }, [route, api]);
    useEffect(() => {
        return () => {
            if (abortRequest.current) abortRequest.current();
        };
    }, []);

    return [data, error, () => abortRequest.current()];
};


export const usePaginated = route => {
    const api = useContext(APIEndpoints);
    const abortRequest = useRef();
    const inFlight = useRef();
    const nextPage = useRef();
    const [state, setState] = useState({
        loading: true,
        data: [],
        hasMore: true,
        total: 0,
        error: null
    });

    const next = () => {
        if (inFlight.current) return;
        const path = nextPage.current || route;

        const [request, ar] = api.abortableGet(path);
        inFlight.current = true;
        abortRequest.current = ar;

        request.then(data => {
            inFlight.current = false;
            if (!data) return;
            nextPage.current = data.next;
            setState(prevState => ({
                ...prevState, loading: false,
                data: [...prevState.data, ...data.results],
                total: data.total,
                hasMore: !!data.next
            }));
        }).catch(e => {
            inFlight.current = false;
            setState(prevState => ({
                ...prevState,
                loading: false,
                error: api.getError(e)
            }));
        });
        setState(prevState => ({ ...prevState, loading: true }));
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

    const nextPage = useRef();
    const [state, setState] = useState({
        data: [],
        error: null
    });

    const more = () => {
        let path = nextPage.current || route;

        const [request, ar] = api.abortableGet(path);
        abortRequest.current = ar;

        request.then(data => {
            if (!data) return;
            nextPage.current = data.next;
            setState(prevState => ({
                ...prevState, data: [...prevState.data, ...data.results]
            }));
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
