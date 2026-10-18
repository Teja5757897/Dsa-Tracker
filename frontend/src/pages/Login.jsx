import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import "../css/Auth.css";

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiFetch("/api/auth/login", { method: "POST", body: form });
            login(data.user, data.token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed. Try again.");
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <aside className="auth-aside">
                <h1>Pick up where you left off.</h1>
                <p>Log in to bring your solved questions, bookmarks and daily streak back on any device.</p>
            </aside>

            <section className="panel auth-card">
                <h2>Welcome back</h2>
                <p className="auth-subtitle">Log in to continue your progress</p>

                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} noValidate={false}>
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
                            placeholder="Your password"
                            autoComplete="current-password"
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

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/Register">Register</Link>
                </p>
            </section>
        </div>
    );
};

export default Login;
