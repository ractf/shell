import { useContext, useState, useEffect, useCallback, useRef } from "react";

import { APIEndpoints } from "./Contexts";


export const useApi = route => {
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


export const usePaginated = route => {
    const api = useContext(APIEndpoints);

    const [results, setResults] = useState({
        results: [],
        total: 0,
        hasMore: true,
    });
    const [extLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const page = useRef();
    page.current = page.current || 1;
    const loading = useRef();
    loading.current = loading.current || false;
    const hasMore = useRef();
    hasMore.current = (typeof hasMore.current == "undefined") ? true : hasMore.current;

    const next = useCallback(() => {
        if (!results.hasMore || loading.current) return;
        setLoading(true);

        let path = (page.current === 0) ? route : (route + "?page=" + page.current);
        api.get(path).then(data => data.d).then(data => {
            page.current++;
            setResults({
                results: [...results.results, ...data.results],
                total: data.count,
                hasMore: !!data.next,
            });
            loading.current = false;
            setLoading(loading.current);
        }).catch(e => setError(api.getError(e)));
    }, [results, route, api]);

    useEffect(() => {
        next();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [results, next, extLoading, error];
};


export const useFullyPaginated = route => {
    const api = useContext(APIEndpoints);

    const [extResults, setResults] = useState([]);
    const [error, setError] = useState(null);

    const page = useRef();
    page.current = page.current || 1;
    const results = useRef();
    results.current = results.current || [];

    const more = () => {
        let path = (page.current === 0) ? route : (route + "?page=" + page.current);
        api.get(path).then(data => data.d).then(data => {
            results.current = [...results.current, ...data.results];
            page.current++;
            if (data.next) more();
            setResults(results.current);
        }).catch(e => setError(api.getError(e)));
    };

    useEffect(() => {
        more();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [extResults, error];
};
