// One row in a question list: mark solved, open on LeetCode, bookmark.
const QuestionCard = ({ question, isSolved, isSaved, onToggleSolved, onToggleSaved, showTopic = false }) => {
    const open = () => {
        if (question.leetcode) window.open(question.leetcode, "_blank", "noopener,noreferrer");
    };

    const stop = (handler) => (e) => {
        e.stopPropagation();
        handler(question._id);
    };

    return (
        <div
            className={`q-row ${isSolved ? "is-solved" : ""} ${question.leetcode ? "" : "no-link"}`}
            role="link"
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    open();
                }
            }}
            aria-label={`${question.title}. Opens on LeetCode in a new tab.`}
        >
            <button
                type="button"
                className="q-check"
                aria-pressed={isSolved}
                aria-label={isSolved ? "Mark as not solved" : "Mark as solved"}
                onClick={stop(onToggleSolved)}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                        d="M2.5 7.5l3 3 6-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="q-body">
                <h3>{question.title}</h3>
                <div className="q-meta">
                    {question.difficulty && (
                        <span className={`tag tag-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
                    )}
                    {showTopic && question.topic && <span className="q-topic">{question.topic}</span>}
                </div>
            </div>

            <button
                type="button"
                className={`q-save ${isSaved ? "is-saved" : ""}`}
                aria-pressed={isSaved}
                aria-label={isSaved ? "Remove from saved" : "Save for later"}
                onClick={stop(onToggleSaved)}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        </div>
    );
};

export default QuestionCard;
