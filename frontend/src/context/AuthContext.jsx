import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";

const AuthContext = createContext(null);

// A broken value in localStorage should never crash the app
const readUser = () => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const readToken = () => {
    try {
        return localStorage.getItem("token") || null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readUser);
    const [token, setToken] = useState(readToken);

    useEffect(() => {
        try {
            if (token) localStorage.setItem("token", token);
            else localStorage.removeItem("token");
        } catch {
            // storage unavailable (private mode); the session just won't persist
        }
    }, [token]);

    useEffect(() => {
        try {
            if (user) localStorage.setItem("user", JSON.stringify(user));
            else localStorage.removeItem("user");
        } catch {
            // ignore
        }
    }, [user]);

    const login = useCallback((userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    // On load, check that a saved login is still valid. Expired sessions are cleared.
    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        apiFetch("/api/auth/me", { token })
            .then((data) => {
                if (!cancelled && data?.user) setUser(data.user);
            })
            .catch((err) => {
                if (!cancelled && err.status === 401) logout();
            });

        return () => {
            cancelled = true;
        };
        // only needs to run once per saved token
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({ user, token, login, logout, isAuthenticated: !!token }),
        [user, token, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
