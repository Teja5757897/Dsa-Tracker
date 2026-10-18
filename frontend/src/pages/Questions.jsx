import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useProgress } from "../context/ProgressContext";
import QuestionCard from "../components/QuestionCard";
import "../css/Questions.css";

const FILTERS = [
    { id: "all", label: "All" },
    { id: "todo", label: "To do" },
    { id: "solved", label: "Solved" },
    { id: "saved", label: "Saved" },
];

const Questions = () => {
    const { topic } = useParams();
    const { data, loading, error, reload } = useFetch(`/api/questions/topic/${encodeURIComponent(topic)}`);
    const { solved, saved, toggleSolved, toggleSaved } = useProgress();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const questions = useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const solvedSet = useMemo(() => new Set(solved), [solved]);
    const savedSet = useMemo(() => new Set(saved), [saved]);

    const solvedInTopic = questions.filter((q) => solvedSet.has(q._id)).length;
    const percent = questions.length ? Math.round((solvedInTopic / questions.length) * 100) : 0;

    const visible = useMemo(() => {
        const term = search.trim().toLowerCase();
        return questions.filter((q) => {
            if (term && !q.title.toLowerCase().includes(term)) return false;
            if (filter === "solved") return solvedSet.has(q._id);
            if (filter === "todo") return !solvedSet.has(q._id);
            if (filter === "saved") return savedSet.has(q._id);
            return true;
        });
    }, [questions, search, filter, solvedSet, savedSet]);

    return (
        <div className="page">
            <Link to="/BrowseTopics" className="back-link">
                ‹ All topics
            </Link>

            <header className="page-head q-head">
                <h1 className="page-title">{topic}</h1>
                {questions.length > 0 && (
                    <div className="q-progress">
                        <div className="meter" aria-hidden="true">
                            <span style={{ width: `${percent}%` }} />
                        </div>
                        <span className="num">
                            {solvedInTopic}/{questions.length} solved
                        </span>
                    </div>
                )}
            </header>

            {!error && (loading || questions.length > 0) && (
                <div className="toolbar">
                    <input
                        type="search"
                        className="field-input"
                        placeholder="Search questions"
                        aria-label="Search questions"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="seg" role="group" aria-label="Filter questions">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className={filter === f.id ? "is-active" : ""}
                                aria-pressed={filter === f.id}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="q-list" aria-busy="true">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="skeleton q-skeleton" />
                    ))}
                </div>
            )}

            {error && (
                <div className="notice">
                    <h3>Couldn't load questions</h3>
                    <p>{error}</p>
                    <button className="btn btn-line" onClick={reload}>
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && questions.length === 0 && (
                <div className="notice">
                    <h3>No questions in this topic</h3>
                    <p>Check the topic name, or go back and pick another one.</p>
                    <Link to="/BrowseTopics" className="btn btn-line">
                        Browse topics
                    </Link>
                </div>
            )}

            {!loading && !error && questions.length > 0 && visible.length === 0 && (
                <div className="notice">
                    <h3>Nothing matches</h3>
                    <p>Change the filter or clear the search to see questions again.</p>
                </div>
            )}

            <div className="q-list">
                {visible.map((question) => (
                    <QuestionCard
                        key={question._id}
                        question={question}
                        isSolved={solvedSet.has(question._id)}
                        isSaved={savedSet.has(question._id)}
                        onToggleSolved={toggleSolved}
                        onToggleSaved={toggleSaved}
                    />
                ))}
            </div>
        </div>
    );
};

export default Questions;
