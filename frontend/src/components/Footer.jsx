import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/Footer.css";

const TIPS = [
    "Start with brute force, then optimise. A working solution beats a perfect idea.",
    "Say your approach out loud before you code. It's the same skill interviews test.",
    "Consistency beats intensity. Two problems a day beat twenty on Sunday.",
    "Stuck for 30 minutes? Read the hint, then re-solve it from scratch tomorrow.",
    "Learn the pattern, not the problem: sliding window, two pointers, DP, BFS/DFS.",
    "Always check edge cases: empty input, one element, duplicates, negatives.",
    "Write down the time and space complexity for every solution you finish.",
];

// One tip per calendar day: changes daily, stays the same on reload
const getTipOfTheDay = () => TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];

const Footer = () => {
    const { isAuthenticated } = useAuth();
    const [showTop, setShowTop] = useState(false);
    const year = new Date().getFullYear();

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <>
            <footer className="mainFooter">
                <div className="footerInner">
                    <div className="footerHero">
                        <h2>Let's crack some code</h2>
                        <p>Practice DSA questions, track your progress, and improve your problem-solving skills.</p>
                        <p>
                            Questions are based on the <strong>Love Babbar DSA Sheet</strong>.
                        </p>
                        <Link to="/BrowseTopics" className="footerCta">
                            Start practising
                        </Link>
                    </div>

                    <div className="footerGrid">
                        <div className="footerCol">
                            <h4>Explore</h4>
                            <Link to="/">Home</Link>
                            <Link to="/BrowseTopics">Browse Topics</Link>
                            <Link to="/Saved">Saved Questions</Link>
                            <Link to="/Target">Daily Target</Link>
                        </div>

                        <div className="footerCol">
                            <h4>Account</h4>
                            {isAuthenticated ? (
                                <Link to="/Profile">My profile</Link>
                            ) : (
                                <>
                                    <Link to="/Login">Log in</Link>
                                    <Link to="/Register">Create account</Link>
                                </>
                            )}
                        </div>

                        <div className="footerCol footerTip">
                            <h4>Tip of the day</h4>
                            <p>{getTipOfTheDay()}</p>
                        </div>
                    </div>

                    <p className="copyright">
                        © {year} DSA Tracker | DSA questions curated from Love Babbar's DSA Sheet
                    </p>
                </div>
            </footer>

            <button
                className={`backToTop ${showTop ? "backToTop--visible" : ""}`}
                onClick={scrollToTop}
                aria-label="Back to top"
                tabIndex={showTop ? 0 : -1}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                        d="M4 11l5-5 5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </>
    );
};

export default Footer;
