import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";

// Loads JSON from the backend and tracks loading / error state.
// Call reload() to try again after an error.
export function useFetch(path) {
    const [state, setState] = useState({ data: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setState((prev) => ({ ...prev, loading: true, error: null }));

        apiFetch(path, { signal: controller.signal })
            .then((data) => setState({ data, loading: false, error: null }))
            .catch((err) => {
                if (err.name === "AbortError") return;
                setState({ data: null, loading: false, error: err.message });
            });

        return () => controller.abort();
    }, [path, attempt]);

    const reload = useCallback(() => setAttempt((n) => n + 1), []);

    return { ...state, reload };
}
