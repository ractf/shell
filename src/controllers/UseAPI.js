import { useState, useEffect, useRef } from "react";

import { http } from "ractf";


export const useApi = route => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const abortRequest = useRef();

    useEffect(() => {
        const [request, ar] = http.abortableGet(route);
        abortRequest.current = ar;
        request.then(data => {
            setData(data);
        }).catch(e => setError(http.getError(e)));
    }, [route]);
    useEffect(() => {
        return () => {
            if (abortRequest.current) abortRequest.current();
        };
    }, []);

    return [data, error, () => abortRequest.current()];
};


export const usePaginated = route => {
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

        const [request, ar] = http.abortableGet(path);
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
                error: http.getError(e)
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
    const abortRequest = useRef();

    const nextPage = useRef();
    const [state, setState] = useState({
        data: [],
        error: null
    });

    const more = () => {
        const path = nextPage.current || route;

        const [request, ar] = http.abortableGet(path);
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
                ...prevState, error: http.getError(e)
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
