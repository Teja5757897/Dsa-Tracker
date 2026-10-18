import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../api";
import { calcStreak, todayKey } from "../utils";

/*
  Keeps the user's solved / saved questions and daily target in one place.
  - Always stored in localStorage, so it works without an account.
  - When logged in, it is also synced to the backend so it follows the user to other devices.
*/

const ProgressContext = createContext(null);

const read = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) ?? fallback;
    } catch {
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage full or blocked; progress stays in memory for this visit
    }
};

const readArray = (key) => {
    const value = read(key, []);
    return Array.isArray(value) ? value : [];
};

const readTarget = () => {
    const value = Number(read("dailyTarget", 3));
    return Number.isFinite(value) && value >= 1 ? Math.min(50, Math.round(value)) : 3;
};

const readDates = () => {
    const value = read("solvedDates", {});
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
};

const union = (a, b) => [...new Set([...a, ...b])];

export const ProgressProvider = ({ children }) => {
    const { token, logout } = useAuth();

    const [solved, setSolved] = useState(() => readArray("solvedQuestions"));
    const [saved, setSaved] = useState(() => readArray("savedQuestions"));
    const [solvedDates, setSolvedDates] = useState(readDates);
    const [dailyTarget, setDailyTargetState] = useState(readTarget);
    const [syncState, setSyncState] = useState("idle"); // idle | syncing | synced | error

    const latest = useRef({});
    latest.current = { solved, saved, solvedDates, dailyTarget };

    const hydrated = useRef(false);
    const previousToken = useRef(token);

    // Keep the browser copy up to date
    useEffect(() => write("solvedQuestions", solved), [solved]);
    useEffect(() => write("savedQuestions", saved), [saved]);
    useEffect(() => write("solvedDates", solvedDates), [solvedDates]);
    useEffect(() => write("dailyTarget", dailyTarget), [dailyTarget]);

    const push = useCallback(
        (data) => {
            setSyncState("syncing");
            return apiFetch("/api/progress", { method: "PUT", token, body: data })
                .then(() => setSyncState("synced"))
                .catch((err) => {
                    if (err.status === 401) logout();
                    setSyncState("error");
                });
        },
        [token, logout]
    );

    // When a user logs in: merge what's on the server with what's in this browser.
    // When they log out: clear this browser so the next person starts fresh.
    useEffect(() => {
        hydrated.current = false;

        if (previousToken.current && !token) {
            setSolved([]);
            setSaved([]);
            setSolvedDates({});
            setDailyTargetState(3);
            setSyncState("idle");
        }
        previousToken.current = token;

        if (!token) return;

        let cancelled = false;
        setSyncState("syncing");

        apiFetch("/api/progress", { token })
            .then((server) => {
                if (cancelled) return;

                const local = latest.current;
                const merged = {
                    solved: union(local.solved, server.solved || []),
                    saved: union(local.saved, server.saved || []),
                    solvedDates: { ...(server.solvedDates || {}) },
                    dailyTarget: server.updatedAt ? server.dailyTarget : local.dailyTarget,
                };

                // keep the earliest date when both sides know a question
                for (const [id, day] of Object.entries(local.solvedDates)) {
                    const other = merged.solvedDates[id];
                    merged.solvedDates[id] = other && other < day ? other : day;
                }
                // a question solved with no date counts as today
                for (const id of merged.solved) {
                    if (!merged.solvedDates[id]) merged.solvedDates[id] = todayKey();
                }

                setSolved(merged.solved);
                setSaved(merged.saved);
                setSolvedDates(merged.solvedDates);
                setDailyTargetState(merged.dailyTarget);
                hydrated.current = true;
                push(merged);
            })
            .catch((err) => {
                if (cancelled) return;
                if (err.status === 401) logout();
                setSyncState("error");
            });

        return () => {
            cancelled = true;
        };
    }, [token, logout, push]);

    // After each change, save to the server (waits a moment so quick clicks batch together)
    useEffect(() => {
        if (!token || !hydrated.current) return;
        const timer = setTimeout(() => push({ solved, saved, solvedDates, dailyTarget }), 700);
        return () => clearTimeout(timer);
    }, [solved, saved, solvedDates, dailyTarget, token, push]);

    const toggleSolved = useCallback((id) => {
        setSolved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
        setSolvedDates((prev) => {
            const next = { ...prev };
            if (next[id]) delete next[id];
            else next[id] = todayKey();
            return next;
        });
    }, []);

    const toggleSaved = useCallback((id) => {
        setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    const setDailyTarget = useCallback((value) => {
        const n = Math.round(Number(value));
        setDailyTargetState(Number.isFinite(n) ? Math.min(50, Math.max(1, n)) : 3);
    }, []);

    const value = useMemo(() => {
        const today = todayKey();
        const solvedToday = solved.filter((id) => solvedDates[id] === today).length;

        return {
            solved,
            saved,
            solvedDates,
            dailyTarget,
            solvedToday,
            streak: calcStreak(solvedDates),
            syncState,
            toggleSolved,
            toggleSaved,
            setDailyTarget,
        };
    }, [solved, saved, solvedDates, dailyTarget, syncState, toggleSolved, toggleSaved, setDailyTarget]);

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => useContext(ProgressContext);
