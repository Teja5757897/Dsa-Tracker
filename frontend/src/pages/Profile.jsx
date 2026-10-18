import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { countByDay, dateKey, daysAgo } from "../utils";
import "../css/Profile.css";

const SYNC_TEXT = {
    idle: "",
    syncing: "Syncing...",
    synced: "Synced to your account",
    error: "Not synced. We'll try again on your next change.",
};

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { solved, saved, solvedDates, solvedToday, dailyTarget, streak, syncState } = useProgress();

    // questions solved on each of the last 7 days, oldest first
    const week = useMemo(() => {
        const counts = countByDay(solvedDates);
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = daysAgo(6 - i);
            return {
                key: dateKey(date),
                label: date.toLocaleDateString(undefined, { weekday: "short" }),
                count: counts[dateKey(date)] || 0,
            };
        });
        return { days, max: Math.max(dailyTarget, ...days.map((d) => d.count), 1) };
    }, [solvedDates, dailyTarget]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="page profile-page">
                <div className="notice">
                    <h3>You're not logged in</h3>
                    <p>Log in to view your profile and sync your progress across devices.</p>
                    <Link to="/Login" className="btn btn-primary">
                        Go to login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page profile-page">
            <header className="profile-head">
                <div className="profile-avatar" aria-hidden="true">
                    {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                    <h1>{user.username}</h1>
                    <p className="profile-email">{user.email}</p>
                    {SYNC_TEXT[syncState] && <p className={`sync sync-${syncState}`}>{SYNC_TEXT[syncState]}</p>}
                </div>
            </header>

            <section className="profile-stats" aria-label="Your stats">
                <div className="stat">
                    <span className="stat-value num">{solved.length}</span>
                    <span className="stat-label">Solved</span>
                </div>
                <div className="stat">
                    <span className="stat-value num">{saved.length}</span>
                    <span className="stat-label">Saved</span>
                </div>
                <div className="stat">
                    <span className="stat-value num">{streak}</span>
                    <span className="stat-label">Day streak</span>
                </div>
                <div className="stat">
                    <span className="stat-value num">
                        {solvedToday}
                        <small>/{dailyTarget}</small>
                    </span>
                    <span className="stat-label">Today's goal</span>
                </div>
            </section>

            <section className="panel week" aria-label="Last 7 days">
                <h2>Last 7 days</h2>
                <div className="week-bars">
                    {week.days.map((day) => (
                        <div key={day.key} className="week-col">
                            <span className="week-count num">{day.count || ""}</span>
                            <div className="week-track">
                                <span
                                    className={day.count >= dailyTarget ? "hit" : ""}
                                    style={{ height: `${(day.count / week.max) * 100}%` }}
                                />
                            </div>
                            <span className="week-label">{day.label}</span>
                        </div>
                    ))}
                </div>
                <p className="week-note">Filled bars in yellow mean you reached your daily target of {dailyTarget}.</p>
            </section>

            <div className="profile-actions">
                <Link to="/Target" className="btn btn-line">
                    Change daily target
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Profile;
