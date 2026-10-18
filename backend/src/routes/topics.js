const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET /api/topics
// -> [{ name, questionCount, questionIds }] in sheet order
router.get("/", async (req, res, next) => {
    try {
        const rows = await Question.aggregate([
            { $sort: { order: 1 } },
            {
                $group: {
                    _id: "$topic",
                    firstOrder: { $min: "$order" },
                    questionIds: { $push: "$_id" },
                    questionCount: { $sum: 1 },
                },
            },
            { $sort: { firstOrder: 1 } },
        ]);

        res.json(
            rows.map((row) => ({
                name: row._id,
                questionCount: row.questionCount,
                questionIds: row.questionIds.map(String),
            }))
        );
    } catch (err) {
        next(err);
    }
});

module.exports = router;
