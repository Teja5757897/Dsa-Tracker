import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useProgress } from "../context/ProgressContext";
import QuestionCard from "../components/QuestionCard";
import "../css/Questions.css";

const Saved = () => {
    const { data, loading, error, reload } = useFetch("/api/questions");
    const { solved, saved, toggleSolved, toggleSaved } = useProgress();
    const [search, setSearch] = useState("");

    const solvedSet = useMemo(() => new Set(solved), [solved]);
    const savedSet = useMemo(() => new Set(saved), [saved]);

    const savedQuestions = useMemo(() => {
        const list = Array.isArray(data) ? data : [];
        const term = search.trim().toLowerCase();
        return list.filter(
            (q) => savedSet.has(q._id) && (!term || q.title.toLowerCase().includes(term))
        );
    }, [data, savedSet, search]);

    const hasSaved = saved.length > 0;

    return (
        <div className="page">
            <header className="page-head">
                <h1 className="page-title">Saved questions</h1>
                <p className="page-sub">
                    {hasSaved
                        ? `${saved.length} bookmarked. Tap the bookmark again to remove one.`
                        : "Bookmark a question while you practise and it will show up here."}
                </p>
            </header>

            {hasSaved && !error && (
                <div className="toolbar">
                    <input
                        type="search"
                        className="field-input"
                        placeholder="Search saved questions"
                        aria-label="Search saved questions"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            {loading && hasSaved && (
                <div className="q-list" aria-busy="true">
                    {Array.from({ length: Math.min(saved.length, 5) }, (_, i) => (
                        <div key={i} className="skeleton q-skeleton" />
                    ))}
                </div>
            )}

            {error && (
                <div className="notice">
                    <h3>Couldn't load your saved questions</h3>
                    <p>{error}</p>
                    <button className="btn btn-line" onClick={reload}>
                        Try again
                    </button>
                </div>
            )}

            {!hasSaved && !error && (
                <div className="notice">
                    <h3>Nothing saved yet</h3>
                    <p>Open a topic and tap the bookmark on any question.</p>
                    <Link to="/BrowseTopics" className="btn btn-primary">
                        Browse topics
                    </Link>
                </div>
            )}

            {hasSaved && !loading && !error && savedQuestions.length === 0 && (
                <div className="notice">
                    <h3>{search ? "Nothing matches your search" : "Your saved questions aren't in the list"}</h3>
                    <p>
                        {search
                            ? "Clear the search to see all saved questions."
                            : "They may have been removed from the question list."}
                    </p>
                </div>
            )}

            <div className="q-list">
                {savedQuestions.map((question) => (
                    <QuestionCard
                        key={question._id}
                        question={question}
                        showTopic
                        isSolved={solvedSet.has(question._id)}
                        isSaved
                        onToggleSolved={toggleSolved}
                        onToggleSaved={toggleSaved}
                    />
                ))}
            </div>
        </div>
    );
};

export default Saved;
