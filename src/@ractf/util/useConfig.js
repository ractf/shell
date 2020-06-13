import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const useConfig = (key, fallback) => {
    const storeValue = useSelector(store => (store.config || {})[key]);
    const [value, setValue] = useState(storeValue !== undefined ? storeValue : fallback);
    useEffect(() => {
        setValue(storeValue !== undefined ? storeValue : fallback);
    }, [storeValue, fallback]);
    return value;
};
export default useConfig;
