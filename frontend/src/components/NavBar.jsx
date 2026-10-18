import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import "../components/Navcss.css";

const LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/BrowseTopics", label: "Browse Topics" },
    { to: "/Saved", label: "Saved Questions" },
    { to: "/Target", label: "Daily Target" },
];

const NavBar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { streak } = useProgress();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    const username = user?.username || "Profile";
    const initial = (user?.username || "U").charAt(0).toUpperCase();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                setDropdownOpen(false);
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMenuOpen(false);
        logout();
    };

    return (
        <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
            <div className="mainNav">
                <Link to="/" className="nav-brand" aria-label="DSA Tracker home">
                    <span className="nav-brand-icon">&lt;/&gt;</span>
                    <span className="nav-brand-text">DSA Tracker</span>
                </Link>

                <button
                    className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
                    {LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
                        >
                            {label}
                        </NavLink>
                    ))}

                    {streak > 0 && (
                        <span className="nav-streak" title={`${streak} day solving streak`}>
                            <b>{streak}</b> day streak
                        </span>
                    )}

                    {isAuthenticated ? (
                        <div className="nav-user" ref={dropdownRef}>
                            <button
                                className="nav-avatar-btn"
                                onClick={() => setDropdownOpen((o) => !o)}
                                aria-haspopup="menu"
                                aria-expanded={dropdownOpen}
                            >
                                <span className="nav-avatar">{initial}</span>
                                <span className="nav-username">{username}</span>
                                <svg
                                    className={`nav-caret ${dropdownOpen ? "is-open" : ""}`}
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M2 4l4 4 4-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="nav-dropdown" role="menu">
                                    <div className="nav-dropdown-head">
                                        <span className="nav-avatar nav-avatar--lg">{initial}</span>
                                        <div>
                                            <strong>{username}</strong>
                                            <small>{user?.email || "Signed in"}</small>
                                        </div>
                                    </div>
                                    <Link to="/Profile" className="nav-dropdown-item" role="menuitem">
                                        My profile
                                    </Link>
                                    <Link to="/Saved" className="nav-dropdown-item" role="menuitem">
                                        Saved questions
                                    </Link>
                                    <button
                                        className="nav-logout nav-dropdown-item"
                                        onClick={handleLogout}
                                        role="menuitem"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="nav-auth">
                            <Link to="/Login" className="nav-link">
                                Log in
                            </Link>
                            <Link to="/Register" className="nav-cta">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
