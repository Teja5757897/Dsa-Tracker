const express = require("express");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IDS = 5000;

const cleanIds = (value) =>
    Array.isArray(value)
        ? [...new Set(value.filter((id) => typeof id === "string" && id.length > 0 && id.length <= 64))].slice(0, MAX_IDS)
        : [];

const shape = (progress = {}) => ({
    solved: progress.solved || [],
    saved: progress.saved || [],
    solvedDates: progress.solvedDates || {},
    dailyTarget: progress.dailyTarget || 3,
    updatedAt: progress.updatedAt || null,
});

// GET /api/progress
router.get("/", requireAuth, (req, res) => {
    res.json(shape(req.user.progress));
});

// PUT /api/progress  (replaces the saved progress with what the browser sends)
router.put("/", requireAuth, async (req, res, next) => {
    try {
        const solved = cleanIds(req.body.solved);
        const saved = cleanIds(req.body.saved);

        const solvedDates = {};
        const rawDates = req.body.solvedDates;
        if (rawDates && typeof rawDates === "object" && !Array.isArray(rawDates)) {
            for (const id of solved) {
                if (typeof rawDates[id] === "string" && DATE_REGEX.test(rawDates[id])) {
                    solvedDates[id] = rawDates[id];
                }
            }
        }

        const target = Math.round(Number(req.body.dailyTarget));
        const dailyTarget = Number.isFinite(target) ? Math.min(50, Math.max(1, target)) : 3;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { progress: { solved, saved, solvedDates, dailyTarget, updatedAt: new Date() } } },
            { new: true }
        );

        res.json(shape(user.progress));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
