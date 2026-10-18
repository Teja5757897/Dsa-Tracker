const pad = (n) => String(n).padStart(2, "0");

// Local calendar date as YYYY-MM-DD
export const dateKey = (date = new Date()) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayKey = () => dateKey(new Date());

// Date n days before today
export const daysAgo = (n) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0); // noon avoids daylight saving edge cases
    d.setDate(d.getDate() - n);
    return d;
};

// Consecutive days with at least one solve, counting back from today.
// If nothing is solved yet today, the streak is still alive until the day ends.
export const calcStreak = (solvedDates) => {
    const days = new Set(Object.values(solvedDates));
    let streak = 0;
    let offset = days.has(todayKey()) ? 0 : 1;

    while (days.has(dateKey(daysAgo(offset)))) {
        streak += 1;
        offset += 1;
    }
    return streak;
};

// How many questions were solved on each day
export const countByDay = (solvedDates) => {
    const counts = {};
    for (const day of Object.values(solvedDates)) {
        counts[day] = (counts[day] || 0) + 1;
    }
    return counts;
};
