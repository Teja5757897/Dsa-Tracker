const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/questions  -> every question, in sheet order
router.get("/", async (req, res, next) => {
    try {
        const questions = await Question.find().sort({ order: 1 }).lean();
        res.json(questions);
    } catch (err) {
        next(err);
    }
});

// GET /api/questions/topic/:topic  -> questions of one topic (case-insensitive)
router.get("/topic/:topic", async (req, res, next) => {
    try {
        const name = req.params.topic.trim();
        const questions = await Question.find({
            topic: new RegExp(`^${escapeRegex(name)}$`, "i"),
        })
            .sort({ order: 1 })
            .lean();

        res.json(questions);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
