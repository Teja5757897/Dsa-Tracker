import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import "../css/Auth.css";

const STRENGTH_LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];

const passwordScore = (password) => {
    if (password.length < 6) return 0;
    let score = 1;
    if (password.length >= 10) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
};

const Register = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const score = form.password ? passwordScore(form.password) : -1;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.username.trim().length < 3) {
            setError("Username must be at least 3 characters.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("The two passwords don't match.");
            return;
        }

        setLoading(true);

        try {
            const { username, email, password } = form;
            const data = await apiFetch("/api/auth/register", {
                method: "POST",
                body: { username: username.trim(), email, password },
            });
            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <aside className="auth-aside">
                <h1>Your progress, on every device.</h1>
                <p>Create an account to sync solved questions, bookmarks and your daily target.</p>
                <ul>
                    <li>Anything you've already solved on this device is kept and added to your account.</li>
                    <li>Your streak and solve log carry over when you switch devices.</li>
                </ul>
            </aside>

            <section className="panel auth-card">
                <h2>Create account</h2>
                <p className="auth-subtitle">Start tracking your DSA progress</p>

                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="field-input"
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="yourname"
                        autoComplete="username"
                        minLength={3}
                        maxLength={30}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        className="field-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <div className="password-wrap">
                        <input
                            id="password"
                            className="field-input"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {score >= 0 && (
                        <div className={`strength strength-${score}`} aria-live="polite">
                            <div className="strength-bars" aria-hidden="true">
                                {[1, 2, 3, 4].map((n) => (
                                    <i key={n} className={score >= n ? "on" : ""} />
                                ))}
                            </div>
                            <span>{STRENGTH_LABELS[score]}</span>
                        </div>
                    )}

                    <label htmlFor="confirm">Confirm password</label>
                    <input
                        id="confirm"
                        className="field-input"
                        type={showPassword ? "text" : "password"}
                        name="confirm"
                        value={form.confirm}
                        onChange={handleChange}
                        placeholder="Type it again"
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/Login">Log in</Link>
                </p>
            </section>
        </div>
    );
};

export default Register;
