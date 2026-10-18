import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import ProgressRing from "../components/ProgressRing";
import "../css/Target.css";

const PRESETS = [1, 3, 5, 10];

const Target = () => {
    const navigate = useNavigate();
    const { dailyTarget, setDailyTarget, solvedToday } = useProgress();

    const [target, setTarget] = useState(dailyTarget);
    const [saved, setSaved] = useState(false);
    const timer = useRef(null);

    // don't navigate after the page has been left
    useEffect(() => () => clearTimeout(timer.current), []);

    const handleSave = () => {
        setDailyTarget(target);
        setSaved(true);
        timer.current = setTimeout(() => navigate("/"), 700);
    };

    const decrease = () => setTarget((prev) => Math.max(1, prev - 1));
    const increase = () => setTarget((prev) => Math.min(50, prev + 1));

    const todayPercent = Math.min(100, Math.round((solvedToday / dailyTarget) * 100));

    return (
        <div className="page">
            <header className="page-head">
                <h1 className="page-title">Choose target</h1>
                <p className="page-sub">How many questions do you want to solve daily?</p>
            </header>

            <div className="target-layout">
                <section className="panel target-today" aria-label="Today's progress">
                    <ProgressRing
                        value={todayPercent}
                        size={150}
                        label={`${solvedToday}/${dailyTarget}`}
                        sublabel="solved today"
                    />
                    <p>
                        {solvedToday >= dailyTarget
                            ? "You've hit today's goal. Anything more is a bonus."
                            : `${dailyTarget - solvedToday} more to reach today's goal.`}
                    </p>
                </section>

                <section className="panel target-card" aria-label="Set daily target">
                    <div className="target-counter">
                        <button className="counter-btn" onClick={decrease} aria-label="Decrease target" disabled={target <= 1}>
                            −
                        </button>
                        <span className="counter-value num" aria-live="polite">
                            {target}
                        </span>
                        <button className="counter-btn" onClick={increase} aria-label="Increase target" disabled={target >= 50}>
                            +
                        </button>
                    </div>
                    <p className="counter-label">questions / day</p>

                    <div className="preset-row" role="group" aria-label="Quick targets">
                        {PRESETS.map((value) => (
                            <button
                                key={value}
                                className={`preset-btn num ${target === value ? "active" : ""}`}
                                aria-pressed={target === value}
                                onClick={() => setTarget(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>

                    <button className="btn btn-primary save-btn" onClick={handleSave} disabled={saved}>
                        {saved ? "Target saved" : "Save target"}
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Target;
