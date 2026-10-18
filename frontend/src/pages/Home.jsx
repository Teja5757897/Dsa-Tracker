import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { useFetch } from "../hooks/useFetch";
import SolveLog from "../components/SolveLog";
import "../css/Home.css";

const MENU = [
    { to: "/BrowseTopics", icon: "{ }", title: "Browse Topics", text: "Start solving DSA questions" },
    { to: "/Saved", icon: "[ ]", title: "Saved Questions", text: "Revisit your bookmarked problems" },
    { to: "/Profile", icon: "@", title: "My profile", text: "Manage your account and sync data" },
    { to: "/Target", icon: "> _", title: "Choose Target", text: "Set how many questions to solve daily" },
];

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    const { solved, solvedDates, solvedToday, dailyTarget, streak } = useProgress();
    const { data: questions, error } = useFetch("/api/questions");

    const total = questions?.length ?? 0;

    // only count solved ids that still exist in the question list
    const solvedCount = useMemo(() => {
        if (!questions) return solved.length;
        const ids = new Set(questions.map((q) => q._id));
        return solved.filter((id) => ids.has(id)).length;
    }, [questions, solved]);

    const percentage = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
    const goalPercent = Math.min(100, Math.round((solvedToday / dailyTarget) * 100));
    const goalMet = solvedToday >= dailyTarget;

    return (
        <div className="page home">
            <header className="home-hero">
                <h1 className="home-title">
                    {isAuthenticated && user?.username
                        ? `Welcome back, ${user.username}.`
                        : "Practice DSA, one square at a time."}
                </h1>
                <p className="home-lead">
                    {error
                        ? "The question list isn't loading right now, but your progress is safe on this device."
                        : total > 0
                          ? `You have solved ${solvedCount} of ${total} questions (${percentage}%). ${
                                goalMet ? "Today's goal is done." : `${dailyTarget - solvedToday} more to hit today's goal.`
                            }`
                          : "Pick a topic, solve a question, and watch the log below fill in."}
                </p>
                <div className="home-actions">
                    <Link to="/BrowseTopics" className="btn btn-primary">
                        Browse topics
                    </Link>
                    {!isAuthenticated && (
                        <Link to="/Register" className="btn btn-line">
                            Create account to sync
                        </Link>
                    )}
                </div>
            </header>

            <section className="home-log panel" aria-label="Solve history">
                <div className="home-log-head">
                    <h2>Solve log</h2>
                    <span>Last 20 weeks</span>
                </div>
                <SolveLog solvedDates={solvedDates} weeks={20} />
            </section>

            <section className="home-stats" aria-label="Progress summary">
                <div className="stat">
                    <span className="stat-value num">
                        {solvedCount}
                        <small>/{total || "–"}</small>
                    </span>
                    <span className="stat-label">Questions solved</span>
                </div>
                <div className="stat">
                    <span className="stat-value num">{percentage}%</span>
                    <span className="stat-label">Sheet complete</span>
                </div>
                <div className="stat">
                    <span className="stat-value num">{streak}</span>
                    <span className="stat-label">{streak === 1 ? "Day streak" : "Days streak"}</span>
                </div>
                <div className="stat stat-goal">
                    <span className="stat-value num">
                        {solvedToday}
                        <small>/{dailyTarget}</small>
                    </span>
                    <span className="stat-label">Solved today</span>
                    <div className="meter" aria-hidden="true">
                        <span style={{ width: `${goalPercent}%` }} />
                    </div>
                </div>
            </section>

            <nav className="home-menu" aria-label="Main sections">
                {MENU.map((item) => (
                    <Link key={item.to} to={item.to} className="menu-card">
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-text">
                            <h3 className="menu-name">{item.title}</h3>
                            <span className="menu-details">{item.text}</span>
                        </span>
                        <span className="menu-go" aria-hidden="true">
                            ›
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Home;
