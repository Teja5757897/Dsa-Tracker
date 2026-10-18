import { useMemo } from "react";
import { countByDay, dateKey } from "../utils";
import "./SolveLog.css";

// A GitHub-style grid: one square per day, darker when more questions were solved.
const SolveLog = ({ solvedDates, weeks = 20 }) => {
    const cells = useMemo(() => {
        const counts = countByDay(solvedDates);
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        // start on the Sunday that begins the first week shown
        const start = new Date(today);
        start.setDate(start.getDate() - today.getDay() - (weeks - 1) * 7);

        const list = [];
        for (let i = 0; i < weeks * 7; i += 1) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const key = dateKey(day);
            list.push({
                key,
                count: counts[key] || 0,
                future: day > today,
                label: day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
            });
        }
        return list;
    }, [solvedDates, weeks]);

    const total = Object.keys(solvedDates).length;

    return (
        <div className="solvelog">
            <div className="solvelog-grid" role="img" aria-label={`Solve history for the last ${weeks} weeks`}>
                {cells.map((cell, i) => (
                    <span
                        key={cell.key}
                        className={`solvelog-cell level-${Math.min(cell.count, 3)} ${cell.future ? "is-future" : ""}`}
                        style={{ "--i": i }}
                        title={cell.future ? "" : `${cell.count} solved, ${cell.label}`}
                    />
                ))}
            </div>
            <div className="solvelog-foot">
                <span>{total === 0 ? "Solve a question to light up the first square." : `${total} solved in total`}</span>
                <span className="solvelog-legend" aria-hidden="true">
                    Less
                    <i className="solvelog-cell level-0" />
                    <i className="solvelog-cell level-1" />
                    <i className="solvelog-cell level-2" />
                    <i className="solvelog-cell level-3" />
                    More
                </span>
            </div>
        </div>
    );
};

export default SolveLog;
