import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useProgress } from "../context/ProgressContext";
import "../css/Topics.css";

const Topics = () => {
    const { data, loading, error, reload } = useFetch("/api/topics");
    const { solved } = useProgress();
    const [search, setSearch] = useState("");

    const solvedSet = useMemo(() => new Set(solved), [solved]);

    const topics = useMemo(() => {
        const list = Array.isArray(data) ? data : [];
        const term = search.trim().toLowerCase();
        return term ? list.filter((t) => t.name.toLowerCase().includes(term)) : list;
    }, [data, search]);

    const overall = useMemo(() => {
        const list = Array.isArray(data) ? data : [];
        const total = list.reduce((sum, t) => sum + t.questionCount, 0);
        const done = list.reduce(
            (sum, t) => sum + (t.questionIds || []).filter((id) => solvedSet.has(id)).length,
            0
        );
        return { total, done };
    }, [data, solvedSet]);

    return (
        <div className="page">
            <header className="page-head">
                <h1 className="page-title">Browse topics</h1>
                <p className="page-sub">
                    {overall.total > 0
                        ? `${overall.done} of ${overall.total} questions solved. Each square is one question, filled in when you solve it.`
                        : "Pick a topic to start solving."}
                </p>
            </header>

            <div className="toolbar">
                <input
                    type="search"
                    className="field-input"
                    placeholder="Search topics"
                    aria-label="Search topics"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading && (
                <div className="topic-grid" aria-busy="true">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="skeleton topic-skeleton" />
                    ))}
                </div>
            )}

            {error && (
                <div className="notice">
                    <h3>Couldn't load topics</h3>
                    <p>{error}</p>
                    <button className="btn btn-line" onClick={reload}>
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && topics.length === 0 && (
                <div className="notice">
                    <h3>{search ? "No topics match your search" : "No topics yet"}</h3>
                    <p>
                        {search
                            ? "Try a shorter word, like “tree” or “graph”."
                            : "Add questions to the database with the backend seed script."}
                    </p>
                </div>
            )}

            {!loading && !error && topics.length > 0 && (
                <div className="topic-grid">
                    {topics.map((topic) => {
                        const ids = topic.questionIds || [];
                        const done = ids.filter((id) => solvedSet.has(id)).length;
                        const complete = ids.length > 0 && done === ids.length;

                        return (
                            <Link
                                key={topic.name}
                                to={`/topics/${encodeURIComponent(topic.name)}`}
                                className={`topic-card ${complete ? "is-complete" : ""}`}
                            >
                                <div className="topic-top">
                                    <h2>{topic.name}</h2>
                                    <span className="topic-count num">
                                        {done}/{topic.questionCount}
                                    </span>
                                </div>

                                <div className="topic-squares" aria-hidden="true">
                                    {ids.map((id) => (
                                        <i key={id} className={solvedSet.has(id) ? "on" : ""} />
                                    ))}
                                </div>

                                <span className="topic-foot">
                                    {complete
                                        ? "All solved"
                                        : done > 0
                                          ? `${topic.questionCount - done} left`
                                          : `${topic.questionCount} questions`}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Topics;
